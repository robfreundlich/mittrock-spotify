/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {UIRouterReact} from "@uirouter/react";
import {AppServices} from "app/client/app/AppServices";
import {browserState} from "app/client/app/states";
import {DataStoreDexieLoader, DexieStoreLoadFailure} from "app/client/db/DataStoreDexieLoader";
import {IAlbum} from "app/client/model/Album";
import {IArtist} from "app/client/model/Artist";
import {DataStore} from "app/client/model/DataStore";
import {Favorites} from "app/client/model/Favorites";
import {Genre} from "app/client/model/Genre";
import {IPlaylist} from "app/client/model/Playlist";
import {ITrack, Track} from "app/client/model/Track";
import {ArrayUtils} from "app/client/utils/ArrayUtils";
import {TimeUtils} from "app/client/utils/TimeUtils";
import {SpotifyWebApi} from "spotify-web-api-ts";
import * as SpotifyObjects from "spotify-web-api-ts/types/types/SpotifyObjects";
import {Episode, Playlist, PlaylistItem, SavedAlbum, SavedTrack, SimplifiedPlaylist, SimplifiedTrack} from "spotify-web-api-ts/types/types/SpotifyObjects";
import {
  GetMyPlaylistsResponse,
  GetPlaylistItemsResponse,
  GetSavedAlbumsResponse,
  GetSavedTracksResponse
} from "spotify-web-api-ts/types/types/SpotifyResponses";


export type LoadingDatabaseStatus =
    "unloaded"
    | "clearing_data"
    | "loading_favorites"
    | "loading_albums"
    | "loading_playlists"
    | "loading_playlist_tracks"
    | "saving_to_database"
    | "loaded"
    | "error"
    | "stopped";

export type TrackLoaderStatus = {
  status: LoadingDatabaseStatus;
  offset?: number;
  subprogress?: number;
  error?: string;
  currentPlaylist?: number;
  currentTime: Date;
}

type TrackLoaderStatusNoTime = Omit<TrackLoaderStatus, "currentTime">;

export class TrackLoaderController
{
  private static apiDelayTimeMsec: number = 1;

  public static increaseDelayTime(): void
  {
    if (TrackLoaderController.apiDelayTimeMsec < 256)
    {
      TrackLoaderController.apiDelayTimeMsec *= 2;
      console.log(`Increased delay time to ${TrackLoaderController.apiDelayTimeMsec}`);
    }
  }

  public static isBrowsable(status: LoadingDatabaseStatus): boolean
  {
    return ((status === "loaded") || (status === "stopped") || (status === "error"))
           && (AppServices.dataStore.tracks.length > 0);
  }

  public static isRunning(status: LoadingDatabaseStatus): boolean
  {
    return ((status !== undefined) && (status !== "unloaded") && (status !== "loaded") && (status !== "error") && (status !== "stopped"));
  }

  public static resetDelayTime(): void
  {
    TrackLoaderController.apiDelayTimeMsec = 1;
  }

  private static apiDelay(condition: boolean): Promise<void>
  {
    return TimeUtils.delay(TrackLoaderController.apiDelayTimeMsec, condition);
  }

  private static convertApiPlaylistToIPlaylist(apiPlaylist: SpotifyObjects.Playlist): IPlaylist
  {
    const playlist: IPlaylist = {
      id: apiPlaylist.id,
      name: apiPlaylist.name,
      tracks: [],
      collaborative: apiPlaylist.collaborative,
      description: apiPlaylist.description ?? "",
      owner: apiPlaylist.owner.display_name ?? "",
      snapshot_id: apiPlaylist.snapshot_id,
      visibility: apiPlaylist.public ? "public" : "private",
      sourceType: "playlist"
    };

    return playlist;
  };

  public startTime: number;

  public _onStatusChanged: (status: TrackLoaderStatus) => void;

  private lastRateLimitHit: number;

  private readonly _dataStore: DataStore;

  private readonly _router: UIRouterReact;

  private loaderItemCount: number = 0;

  private spotify: SpotifyWebApi;

  private _playlists: IPlaylist[] = [];

  private _currentPlaylistTotalTracks: number;

  private _status: TrackLoaderStatus;

  private _dbLoader: DataStoreDexieLoader | undefined;

  private _attemptedDBLoad: boolean = false;

  constructor(dataStore: DataStore, router: UIRouterReact, onStatusChanged: (status: TrackLoaderStatus) => void)
  {
    this._dataStore = dataStore;
    this._router = router;
    this._onStatusChanged = onStatusChanged;
  }

  public get dataStore(): DataStore
  {
    return this._dataStore;
  }

  public get status(): TrackLoaderStatus
  {
    return this._status;
  }

  public onAuthTokenChanged(currentAuthToken: string | undefined, previousAuthToken: string | undefined): void
  {
    if (currentAuthToken)
    {
      if (previousAuthToken !== currentAuthToken)
      {
        this.spotify = new SpotifyWebApi({accessToken: currentAuthToken});
      }
    }
  }

  public gotoBrowser(): void
  {
    this._router.stateService.go(browserState.name, undefined, {location: true, reload: true});
  }

  public handlePossibleStateChange(prevState: Readonly<TrackLoaderStatus> | undefined): void
  {
    if ((prevState === undefined) || (JSON.stringify(prevState) !== JSON.stringify(this.status)))
    {
      this.loadNext();
    }
  }

  public setStatus(value: TrackLoaderStatusNoTime): void
  {
    if (!this._attemptedDBLoad && (value.status === "error"))
    {
      this.setStatus({status: "saving_to_database"});

      this.saveToDatabase().then(() => {
        this.setStatus(value);
      });

      return;
    }

    const fullStatus = {...value, currentTime: new Date()};
    this._status = fullStatus;
    this._onStatusChanged(this._status);
  }

  public startLoading(): void
  {
    TrackLoaderController.resetDelayTime();

    this.startTime = new Date().getTime();
    this.setStatus({status: "clearing_data"});
    // window.open("http://localhost:8080/new_window", "_blank", "popup");
  };

  public stop()
  {
    this.setStatus({status: "stopped"});
  }

  private isRateLimitError(error: any): boolean
  {
    return (error.response?.data?.error?.status === 429);
  }

  private getRateLimitRetrySeconds(error: any): number
  {
    return parseInt(error.response?.headers["retry-after"], 10);
  }

  private loadNext(): void
  {
    if (this.status?.status === "clearing_data")
    {
      this.clearData();
    }
    if (this.status?.status === "loading_favorites")
    {
      this.loadFavorites().then(() => {/**/
      });
    }
    else if (this.status?.status === "loading_albums")
    {
      this.loadAlbums().then(() => {/**/
      });
    }
    else if (this.status?.status === "loading_playlists")
    {
      this.loadPlaylists().then(() => {/**/
      });
    }
    else if (this.status?.status === "loading_playlist_tracks")
    {
      this.loadPlaylistTracks(this.status?.currentPlaylist).then(() => {/**/
      });
    }
    else if (this.status?.status === "saving_to_database")
    {
      this.saveToDatabase();
    }
  };

  private async saveToDatabase(): Promise<void>
  {
    if (this._dbLoader)
    {
      return;
    }

    this._attemptedDBLoad = true;
    this._dbLoader = new DataStoreDexieLoader(this._dataStore);
    this._dbLoader.onError = (err: Error) => {
      this.setStatus({
                       status: "error",
                       error: err.stack ?? err.message
                     });
    };

    await this._dbLoader.load();

    if ((this.status.status !== "error") && (this._dbLoader!.loadFailures.length > 0))
    {
      this.setStatus({
                       status: "error",
                       error: this._dbLoader!.loadFailures.map((failure: DexieStoreLoadFailure) => {
                         return `${failure.valueType}: ${failure.value.name} - ${failure.failure}`;
                       }).join("\n")
                     });
    }
    else
    {
      this.setStatus({status: "loaded"});
    }

    this._dbLoader = undefined;
  }

  private clearData(): void
  {
    AppServices.db.albums.clear().then(() => {
      AppServices.db.artists.clear().then(() => {
        AppServices.db.genres.clear().then(() => {
          AppServices.db.titles.clear().then(() => {
            AppServices.db.tracks.clear().then(() => {
              AppServices.db.playlists.clear().then(() => {
                this._dataStore.clear();
                this.setStatus({status: "loading_favorites", offset: 0, subprogress: 0});
              });
            });
          });
        });
      });
    });
  }

  private async callSpotify<T>(getData: () => Promise<T>, apiDelayCondition: boolean = true): Promise<T>
  {
    for (let i = 0; i < 5; i++)
    {
      try
      {
        await TrackLoaderController.apiDelay(apiDelayCondition);
        const result: T = await getData();

        return result;
      }
      catch (err)
      {
        if (this.isRateLimitError(err))
        {
          const delay: number = this.getRateLimitRetrySeconds(err) * 1000;

          console.log((err as Error).message);
          console.log("Pausing for " + delay + " seconds");

          const now: number = new Date().getTime();
          if ((this.lastRateLimitHit === undefined) || ((now - this.lastRateLimitHit) > delay))
          {
            TrackLoaderController.increaseDelayTime();
          }

          this.lastRateLimitHit = now;
          await TimeUtils.delay(delay);
        }
        else
        {
          throw err;
        }
      }
    }

    throw new Error("Too many retries on one call");
  }

  private async loadFavorites(): Promise<void>
  {
    try
    {
      const results: GetSavedTracksResponse = await this.callSpotify(() => this.spotify.library.getSavedTracks({limit: 50, offset: this.status?.offset!}),
                                                                     this.status?.offset! > 0);

      const artistIds: Set<string> = new Set();
      const tracks: Track[] = [];

      results.items.forEach((result: SavedTrack) => {
        const apiTrack: SpotifyObjects.Track = result.track;

        const track: Track = new Track(apiTrack.id,
                                       apiTrack.name,
                                       apiTrack.explicit ? "explicit" : "clean",
                                       Math.floor(apiTrack.duration_ms / 1000),
                                       apiTrack.popularity,
                                       "streaming",
                                       apiTrack.disc_number,
                                       apiTrack.track_number,
                                       Favorites.favorites,
                                       [],  // We'll fill this in later, when we need it.
                                       this.convertApiArtistsToArtists(apiTrack.artists),
                                       this.convertApiAlbumToIAlbum(apiTrack.album),
                                       new Date(result.added_at));

        track.artists.forEach((artist) => {
          artistIds.add(artist.id);
        });

        tracks.push(track);
      });

      this.loaderItemCount += results.items.length;

      const artistIdChunks: string[][] = ArrayUtils.splitIntoChunks([...artistIds], 20);

      await Promise.all(artistIdChunks.map(async (ids: string[]) => {
        const artists: Array<SpotifyObjects.Artist | null> = await this.callSpotify(() => this.spotify.artists.getArtists(ids));
        artists.forEach((artist: SpotifyObjects.Artist | null) => {
          if (artist !== null)
          {
            tracks.filter((track: ITrack) => (track.artists.filter((trackArtist) => trackArtist.id === artist.id)))
                  .forEach((track: ITrack) => {
                    track.genres = artist.genres.map((name) => new Genre(name));
                  });
          }
        });
      }));

      tracks.forEach((track: Track) => {
        this._dataStore.addTrack(track);
      });

      if (this.loaderItemCount === results.total)
      {
        this.loaderItemCount = 0;
        this.setStatus({status: "loading_albums", offset: 0, subprogress: 0});
      }
      else
      {
        this.setStatus({status: this.status?.status, offset: this.status?.offset! + results.items.length});
      }
    }
    catch (err)
    {
      this.setStatus({status: "error", error: (err as Error).stack!});
    }
  };

  private async loadAlbums(): Promise<void>
  {
    try
    {
      const results: GetSavedAlbumsResponse = await this.callSpotify(() => this.spotify.library.getSavedAlbums({limit: 50, offset: this.status?.offset!}),
                                                                     this.status?.offset! > 0);

      const tracks: Track[] = [];

      results.items.forEach((result: SavedAlbum) => {
        const apiAlbum: SpotifyObjects.Album = result.album;
        const album: IAlbum = this.convertApiAlbumToIAlbum(apiAlbum, result.added_at);
        apiAlbum.tracks.items.forEach((apiTrack: SimplifiedTrack) => {

          const track: Track = new Track(apiTrack.id,
                                         apiTrack.name,
                                         apiTrack.explicit ? "explicit" : "clean",
                                         Math.floor(apiTrack.duration_ms / 1000),
                                         0, // We fill this in later, when we need it.
                                         "streaming",
                                         apiTrack.disc_number,
                                         apiTrack.track_number,
                                         album,
                                         apiAlbum.genres.map((genre) => new Genre(genre)),
                                         this.convertApiArtistsToArtists(apiTrack.artists));

          tracks.push(track);
        });
      });

      const allTrackIds: string[] = tracks.map((track: Track) => track.id);

      const trackIdChunks: string[][] = ArrayUtils.splitIntoChunks(allTrackIds, 20);

      await Promise.all(trackIdChunks.map(async (ids: string[]) => {
        const artists: Array<SpotifyObjects.Track | null> = await this.callSpotify(() => this.spotify.tracks.getTracks(ids));
        artists.forEach((apiTrack: SpotifyObjects.Track | null) => {
          if (apiTrack !== null)
          {
            tracks.filter((track: ITrack) => track.id === apiTrack.id)[0].popularity = apiTrack.popularity;
          }
        });
      }));

      tracks.forEach((track: Track) => {
        this._dataStore.addTrack(track);
      });

      this.loaderItemCount += results.items.length;

      if (this.loaderItemCount === results.total)
      {
        this.loaderItemCount = 0;
        this.setStatus({status: "loading_playlists", offset: 0, subprogress: 0});
      }
      else
      {
        this.setStatus({
                         status: this.status?.status,
                         offset: this.status?.offset! + results.items.length,
                         subprogress: this.status?.subprogress! + tracks.length
                       });
      }
    }
    catch (err)
    {
      this.setStatus({status: "error", error: (err as Error).stack!});
    }
  }

  private async loadPlaylists(): Promise<void>
  {
    try
    {
      const results: GetMyPlaylistsResponse = await this.callSpotify(() => this.spotify.playlists.getMyPlaylists({limit: 50, offset: this.status?.offset!}),
                                                                     this.status?.offset! > 0);

      await Promise.all(results.items.map((async (result: SimplifiedPlaylist) => {
        const apiPlaylist: Playlist = await this.callSpotify(() => this.spotify.playlists.getPlaylist(result.id));
        await TrackLoaderController.apiDelay(true);
        const playlist: IPlaylist = TrackLoaderController.convertApiPlaylistToIPlaylist(apiPlaylist);

        this._playlists.push(playlist);
      })));

      this.loaderItemCount += results.items.length;

      if (this.loaderItemCount === results.total)
      {
        this.loaderItemCount = 0;
        this.setStatus({status: "loading_playlist_tracks", offset: 0, subprogress: 0});
      }
      else
      {
        this.setStatus({
                         status: this.status?.status,
                         offset: this.status?.offset! + results.items.length
                       });
      }
    }
    catch (err)
    {
      this.setStatus({status: "error", error: (err as Error).stack!});
    }
  }

  private async loadPlaylistTracks(playlistIndex: number | undefined): Promise<void>
  {
    try
    {
      if (playlistIndex === undefined)
      {
        playlistIndex = 0;
        this._currentPlaylistTotalTracks = 0;
      }

      const playlist = this._playlists[playlistIndex];
      const playListId = playlist.id;

      const tracks: Track[] = [];

      const results: GetPlaylistItemsResponse = await this.callSpotify(() => this.spotify.playlists.getPlaylistItems(playListId,
                                                                                                                     {
                                                                                                                       limit: 100,
                                                                                                                       offset: this.status?.offset!
                                                                                                                     }),
                                                                       this.status?.offset! > 0);
      results.items.forEach((item: PlaylistItem) => {
        const apiTrack: SpotifyObjects.Track | Episode = item.track;
        if (apiTrack.type === "episode")
        {
          // for now
          return;
        }

        const track: Track = new Track(apiTrack.id,
                                       apiTrack.name,
                                       apiTrack.explicit ? "explicit" : "clean",
                                       Math.floor(apiTrack.duration_ms / 1000),
                                       0, // We fill this in later, when we need it.
                                       "streaming",
                                       apiTrack.disc_number,
                                       apiTrack.track_number,
                                       playlist,
                                       [],
                                       this.convertApiArtistsToArtists(apiTrack.artists));

        tracks.push(track);
      });

      tracks.forEach((track: Track) => {
        this._dataStore.addTrack(track);
      });

      this._currentPlaylistTotalTracks += results.items.length;

      if (this._currentPlaylistTotalTracks === results.total)
      {
        this._currentPlaylistTotalTracks = 0;
        if (playlistIndex == this._playlists.length - 1)
        {
          this.setStatus({status: "saving_to_database"});
        }
        else
        {
          this.setStatus({
                           status: this.status?.status,
                           offset: 0,
                           subprogress: this.status?.subprogress!,
                           currentPlaylist: playlistIndex + 1
                         });
        }
      }
      else
      {
        this.setStatus({
                         status: this.status?.status,
                         offset: this.status?.offset! + results.items.length,
                         subprogress: this.status?.subprogress! + tracks.length,
                         currentPlaylist: playlistIndex
                       });
      }
    }
    catch (err)
    {
      this.setStatus({status: "error", error: (err as Error).stack!});
    }
  }

  private convertApiAlbumToIAlbum(apiAlbum: SpotifyObjects.SimplifiedAlbum, addedAt?: string): IAlbum
  {
    const album: IAlbum = {
      id: apiAlbum.id,
      name: apiAlbum.name,
      type: apiAlbum.type,
      tracks: [],
      releaseDate: apiAlbum.release_date,
      releaseDatePrecision: apiAlbum.release_date_precision,
      artists: this.convertApiArtistsToArtists(apiAlbum.artists),
      sourceType: "album",
      addedAt: addedAt ? new Date(addedAt) : undefined
    };

    return album;
  };

  private convertApiArtistsToArtists(apiArtists: SpotifyObjects.SimplifiedArtist[]): IArtist[]
  {
    const artists: IArtist[] = apiArtists.map((apiArtist: SpotifyObjects.SimplifiedArtist) => {
      const artist: IArtist = {
        id: apiArtist.id,
        name: apiArtist.name,
        genres: [],
        popularity: 0
      };

      return artist;
    });

    return artists;
  };
}
