/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {UIRouterReact} from "@uirouter/react";
import {browserState} from "app/client/app/states";
import {DexieStoreLoadFailure} from "app/client/db/DataStoreDexieLoader";
import {DBAlbum, makePartialAlbum, PartialAlbum} from "app/client/db/DBAlbum";
import {DBArtist, makePartialArtist, PartialArtist} from "app/client/db/DBArtist";
import {DBPlaylist, makePartialPlaylist, PartialPlaylist} from "app/client/db/DBPlaylist";
import {DBTrack, makePartialTrack, PartialTrack} from "app/client/db/DBTrack";
import {DexieLoader} from "app/client/db/DexieLoader";
import {DataStore} from "app/client/model/DataStore";
import {ArrayUtils} from "app/client/utils/ArrayUtils";
import {TimeUtils} from "app/client/utils/TimeUtils";
import {InclusionReason, INCLUSION_REASON_FAVORITE} from "app/client/utils/Types";
import pMapSeries from "p-map-series";
import {SpotifyWebApi} from "spotify-web-api-ts";
import * as SpotifyObjects from "spotify-web-api-ts/types/types/SpotifyObjects";
import {
  Episode,
  Paging,
  Playlist,
  PlaylistItem,
  SavedAlbum,
  SavedTrack,
  SimplifiedArtist,
  SimplifiedPlaylist,
  SimplifiedTrack
} from "spotify-web-api-ts/types/types/SpotifyObjects";
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
    | "loading_artists"
    | "saving_to_database"
    | "loaded"
    | "error"
    | "stopped";

export type TrackLoaderStatus = {
  status: LoadingDatabaseStatus;
  subStatus?: string;
  offset?: number;
  limit?: number;
  subprogress?: number;
  error?: string;
  currentPlaylist?: number;
  currentAlbum?: number;
  stopped?: boolean;
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
      TrackLoaderController.log(`Increased delay time to ${TrackLoaderController.apiDelayTimeMsec}`);
    }
  }

  public static isBrowsable(status: LoadingDatabaseStatus): boolean
  {
    return ((status === "loaded") || (status === "stopped") || (status === "error"));
           // && (AppServices.db.tracks.length > 0);
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

  private static log(s: string): void
  {
    const now: Date = new Date();
    console.log(`${now.toISOString()} - ${s}`);
  }

  public startTime: number;

  public _onStatusChanged: (status: TrackLoaderStatus) => void;

  private lastRateLimitHit: number;

  private readonly _dataStore: DataStore;

  private readonly _router: UIRouterReact;

  private loaderItemCount: number = 0;

  private spotify: SpotifyWebApi;

  private _playlists: DBPlaylist[] = [];

  private _currentPlaylistTotalTracks: number;

  private _status: TrackLoaderStatus;

  private _dbLoader: DexieLoader;

  private _attemptedDBLoad: boolean = false;

  private _tracksById: Map<string/*id*/, DBTrack> = new Map();

  private _albumsById: Map<string/*id*/, DBAlbum> = new Map();

  private _artistsById: Map<string/*id*/, DBArtist> = new Map();

  private _artistInclusionReasons: Map<string/*id*/, InclusionReason[]> = new Map();

  private _playlistsById: Map<string/*id*/, DBPlaylist> = new Map();

  private _genres: Set<string> = new Set();

  constructor(dataStore: DataStore, router: UIRouterReact, onStatusChanged: (status: TrackLoaderStatus) => void)
  {
    this._dataStore = dataStore;
    this._router = router;
    this._onStatusChanged = onStatusChanged;
    this._dbLoader = new DexieLoader(this._tracksById, this._albumsById, this._playlistsById, this._artistsById, this._genres);

    this._dbLoader.onProgress = (message) => {
      this.setStatus({...this.status, subStatus: message});
    };
  }

  public get dataStore(): DataStore
  {
    return this._dataStore;
  }

  public get status(): TrackLoaderStatus
  {
    return this._status;
  }

  public get tracks(): DBTrack[]
  {
    return [...this._tracksById.values()];
  }

  public get favorites(): DBTrack[]
  {
    return this.tracks.filter((track: DBTrack) => track.inclusionReasons.indexOf(INCLUSION_REASON_FAVORITE) !== -1);
  }

  public get albums(): DBAlbum[]
  {
    return [...this._albumsById.values()];
  }

  public get playlists(): DBPlaylist[]
  {
    return this._playlists.slice();
  }

  public get artists(): DBArtist[]
  {
    return [...this._artistsById.values()];
  }

  public get genres(): Set<string>
  {
    return new Set(this._genres);
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
    const currentStatus: LoadingDatabaseStatus | undefined = this.status?.status;
    const previousStatus: LoadingDatabaseStatus | undefined = prevState?.status;

    const currentOffset: number = this.status?.offset ?? 0;
    const previousOffset: number = prevState?.offset ?? 0;

    if ((previousStatus !== currentStatus)                                        // Status change
        || ((currentStatus === "loading_playlist_tracks")                         // Playlist changed
            && (prevState?.currentPlaylist !== this.status?.currentPlaylist))
        || ((previousStatus === currentStatus)
            && (currentOffset > previousOffset)))                                 // paging
    {

      TrackLoaderController.log("***************************** STATE TRANSITION ******************************");
      TrackLoaderController.log(`${previousStatus}@${prevState?.offset}`);
      TrackLoaderController.log(`${currentStatus}@${this.status?.offset}`);

      this.loadNext();
    }
  }

  public setStatus(value: TrackLoaderStatusNoTime): void
  {
    if (value.status === "error")
    {
      value.stopped = true;

      if (!this._status.stopped && !this._attemptedDBLoad)
      {
        this.setStatus({...this.status, status: "saving_to_database", stopped: true});

        this.saveToDatabase().then(() => {
          this.setStatus(value);
        });

        return;
      }
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
    this.setStatus({...this.status, status: "stopped", stopped: true});
  }

  private isRateLimitError(error: any): boolean
  {
    return (error.response?.data?.error?.status === 429) || (error.message.indexOf("code 429") !== -1);
  }

  private getRateLimitRetrySeconds(error: any): number
  {
    if (error.response)
    {
      return parseInt(error.response?.headers["retry-after"], 10);
    }
    else
    {
      return 2;
    }
  }

  private async loadNext(): Promise<void>
  {
    if (this.status?.status === "clearing_data")
    {
      this.clearData();
    }
    if (this.status?.status === "loading_favorites")
    {
      this.loadFavorites();
    }
    else if (this.status?.status === "loading_albums")
    {
      this.loadAlbums();
    }
    else if (this.status?.status === "loading_playlists")
    {
      // // Temp
      // this.setStatus({status: "saving_to_database"});
      this.loadPlaylists();
    }
    else if (this.status?.status === "loading_playlist_tracks")
    {
      this.loadPlaylistTracks(this.status?.currentPlaylist);
    }
    else if (this.status?.status === "loading_artists")
    {
      this.loadArtists();
    }
    else if (this.status?.status === "saving_to_database")
    {
      this.saveToDatabase();
    }
  };

  private async saveToDatabase(): Promise<void>
  {
    if (this._attemptedDBLoad)
    {
      return;
    }

    this._attemptedDBLoad = true;
    this._dbLoader.onError = (err: Error) => {
      this.setStatus({
                       ...this.status,
                       status: "error",
                       error: err.stack ?? err.message
                     });
    };

    await this._dbLoader.load();

    if ((this.status.status !== "error") && (this._dbLoader!.loadFailures.length > 0))
    {
      this.setStatus({
                       ...this.status,
                       status: "error",
                       error: this._dbLoader!.loadFailures.map((failure: DexieStoreLoadFailure) => {
                         return `${failure.valueType}: ${failure.value.name} - ${failure.failure}`;
                       }).join("\n")
                     });
    }
    else
    {
      this.setStatus({
                       ...this.status,
                       status: "loaded"
                     });
    }
  }

  private async clearData(): Promise<void>
  {
    await this._dbLoader.clear();
    this._dataStore.clear();
    this.setStatus({status: "loading_favorites", offset: 0, limit: 50, subprogress: 0});
  }

  private async callSpotify<T>(getData: () => Promise<T>, message: string, apiDelayCondition: boolean = true): Promise<T>
  {
    if (this.status.stopped)
    {
      throw new Error("stopped");
    }

    for (let i = 0; i < 5; i++)
    {
      try
      {
        // TrackLoaderController.log(`${message} attempt ${i} - delay`);
        await TrackLoaderController.apiDelay(apiDelayCondition);

        // TrackLoaderController.log(`${message} attempt ${i} - call`);
        const result: T = await getData();

        // TrackLoaderController.log(`${message} attempt ${i} - got result`);

        return result;
      }
      catch (err)
      {
        TrackLoaderController.log(`${message} attempt ${i} - error`);

        if (this.isRateLimitError(err))
        {
          const delay: number = this.getRateLimitRetrySeconds(err) * 1000;

          TrackLoaderController.log((err as Error).message);
          TrackLoaderController.log(`${message} attempt ${i} pausing for ${delay} seconds`);

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

    throw new Error(`${message} Too many retries on one call`);
  }

  private async loadFavorites(): Promise<void>
  {
    // TrackLoaderController.log(`loadFavorites ${this.status.offset}`);
    try
    {
      const results: GetSavedTracksResponse = await this.callSpotify(() => this.spotify.library.getSavedTracks({
                                                                                                                 limit: this.status?.limit!,
                                                                                                                 offset: this.status?.offset!
                                                                                                               }),
                                                                     `getSavedTracks ${this.status?.offset}`,
                                                                     this.status?.offset! > 0);


      // TrackLoaderController.log(`  loadFavorites ${this.status.offset} +callforEach for loadSavedTrack`);
      const dbTracks: DBTrack[] = results.items.map((savedTrack: SavedTrack) => {
        const track: SpotifyObjects.Track = savedTrack.track;

        const dbTrack: DBTrack | null = this.loadSavedTrack(track, INCLUSION_REASON_FAVORITE);
        return dbTrack;
      })
                                         .filter((dbTrack: DBTrack | null) => dbTrack !== null) as DBTrack[];

      // TrackLoaderController.log(`  loadFavorites ${this.status.offset} -callforEach for loadSavedTrack`);

      dbTracks.forEach((dbTrack: DBTrack) => this._tracksById.set(dbTrack.id, dbTrack));

      this.loaderItemCount += results.items.length;

      if (this.loaderItemCount === results.total)
      {
        this.loaderItemCount = 0;
        this.setStatus({status: "loading_albums", offset: 0, limit: 50, subprogress: 0});
      }
      else
      {
        this.setStatus({...this.status, offset: this.status?.offset! + results.items.length});
      }
    }
    catch (err)
    {
      this.setStatus({...this.status, status: "error", error: (err as Error).stack!});
    }
  };

  private loadSavedTrack(track: SpotifyObjects.Track, ...inclusionReasons: InclusionReason[]): DBTrack | null
  {
    // TrackLoaderController.log(`+loadSavedTrack ${track.id}`);
    const partialTrack: PartialTrack = makePartialTrack(track);
    const dbTrack: DBTrack | null = this.loadPartialTrack(partialTrack,
                                                          track.album.id,
                                                          track.artists,
                                                          inclusionReasons);
    // TrackLoaderController.log(`-loadSavedTrack ${track.id}`);
    return dbTrack;
  }

  private loadPartialTrack(partialTrack: PartialTrack,
                           album_id: string,
                           artists: SimplifiedArtist[],
                           inclusionReasons: InclusionReason[]): DBTrack | null
  {
    if (this.status.stopped)
    {
      return null;
    }

    // TrackLoaderController.log(`+loadPartialTrack ${partialTrack.id}`);
    let artistIds = artists.filter((artist: SimplifiedArtist) => artist.id !== "")
                           .map((artist: SimplifiedArtist) => artist.id);

    // Fetch/populate artists and genres
    const artistInclusionReasons: InclusionReason[] = inclusionReasons.filter((inclusionReason) => inclusionReason !== "favorite");

    // TrackLoaderController.log(`  calling loadMisssingArtists ${artistIds.join(",")}, ${inclusionReasons.join(",")}`);
    this.createMissingArtists(artistIds, [...artistInclusionReasons, {type: "track", id: partialTrack.id}]);

    let dbTrack: DBTrack = {
      ...partialTrack,

      album_id: album_id,
      artist_ids: new Set(artistIds),
      genres: new Set(),    // Will be filled in later when we do the massive artist fetch

      inclusionReasons: inclusionReasons
    };

    // TrackLoaderController.log(`-loadPartialTrack ${partialTrack.id}`);
    return dbTrack;
  }

  private async loadAlbums(): Promise<void>
  {
    if (this.status.stopped)
    {
      return Promise.reject();
    }

    try
    {
      const results: GetSavedAlbumsResponse = await this.callSpotify(() => this.spotify.library.getSavedAlbums({
                                                                                                                 limit: this.status?.limit!,
                                                                                                                 offset: this.status?.offset!
                                                                                                               }),
                                                                     `getSavedAlbums ${this.status?.offset}`,
                                                                     this.status?.offset! > 0);

      await pMapSeries(results.items.map((savedAlbum: SavedAlbum) => savedAlbum.album),
                       async (album: SpotifyObjects.Album) => {

                         const partialAlbum: PartialAlbum = makePartialAlbum(album);
                         const dbAlbum: DBAlbum = {
                           ...partialAlbum,

                           artist_ids: album.artists.map((artist: SimplifiedArtist) => artist.id),
                           track_ids: [],
                           inclusionReasons: [INCLUSION_REASON_FAVORITE]
                         };

                         const tracks: DBTrack[] = await this.loadAlbumTracks(album, dbAlbum);

                         const albumInclusion: InclusionReason = {type: "album", id: dbAlbum.id};

                         tracks.forEach((track: DBTrack) => {
                           this.addOrUpdateTrack(track, albumInclusion, dbAlbum.id);
                         });

                         this._albumsById.set(dbAlbum.id, dbAlbum);
                         this.setStatus({
                                          status: this.status?.status,
                                          offset: this.status?.offset!,
                                          subprogress: this.status?.subprogress! + tracks.length,
                                          currentAlbum: this._albumsById.size
                                        });
                       });

      this.loaderItemCount += results.items.length;

      if (this.loaderItemCount === results.total)
      {
        this.loaderItemCount = 0;
        this.setStatus({status: "loading_playlists", offset: 0, limit: 50, subprogress: 0});
      }
      else
      {
        this.setStatus({
                         ...this.status,
                         status: this.status?.status,
                         offset: this.status?.offset! + results.items.length,
                         currentAlbum: this._albumsById.size
                       });
      }
    }
    catch (err)
    {
      this.setStatus({...this.status, status: "error", error: (err as Error).stack!});
    }
  }

  private addOrUpdateTrack(track: DBTrack, inclusionReason: InclusionReason, album_id: string)
  {
    let existingTrack: DBTrack | undefined = this._tracksById.get(track.id);
    if (existingTrack)
    {
      existingTrack = {
        ...track,
        inclusionReasons: (existingTrack.inclusionReasons.indexOf(inclusionReason) === -1)
                          ? [...existingTrack.inclusionReasons, inclusionReason]
                          : existingTrack.inclusionReasons,
        album_id: existingTrack.album_id ?? album_id
      };

    }
    else
    {
      existingTrack = track;
    }

    this._tracksById.set(track.id, existingTrack);
  }

  private async loadPlaylists(): Promise<void>
  {
    if (this.status.stopped)
    {
      return Promise.reject();
    }

    try
    {
      const results: GetMyPlaylistsResponse = await this.callSpotify(() => this.spotify.playlists.getMyPlaylists({
                                                                                                                   limit: this.status?.limit!,
                                                                                                                   offset: this.status?.offset!
                                                                                                                 }),
                                                                     `getMyPlaylists ${this.status?.offset}`,
                                                                     this.status?.offset! > 0);

      await pMapSeries(results.items,
                       async (result: SimplifiedPlaylist) => {
                         const apiPlaylist: Playlist = await this.callSpotify(() => this.spotify.playlists.getPlaylist(result.id),
                                                                              `getPlaylist ${result.id}`);
                         await TrackLoaderController.apiDelay(true);

                         const partialPlaylist: PartialPlaylist = makePartialPlaylist(apiPlaylist);
                         const playlist: DBPlaylist = {
                           ...partialPlaylist,
                           track_ids: [],

                           inclusionReasons: [INCLUSION_REASON_FAVORITE]
                         };

                         this._playlists.push(playlist);
                         this._playlistsById.set(playlist.id, playlist);
                       });


      this.loaderItemCount += results.items.length;

      if (this.loaderItemCount === results.total)
      {
        this.loaderItemCount = 0;
        this.setStatus({status: "loading_playlist_tracks", offset: 0, limit: 100, subprogress: 0});
      }
      else
      {
        this.setStatus({
                         ...this.status,
                         offset: this.status?.offset! + results.items.length
                       });
      }
    }
    catch (err)
    {
      this.setStatus({...this.status, status: "error", error: (err as Error).stack!});
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

      const results: GetPlaylistItemsResponse = await this.callSpotify(() => this.spotify.playlists.getPlaylistItems(playListId,
                                                                                                                     {
                                                                                                                       limit: this.status?.limit!,
                                                                                                                       offset: this.status?.offset!
                                                                                                                     }),
                                                                       `getPlaylistItems ${this.status?.offset}`,
                                                                       this.status?.offset! > 0);

      const tracksEtc: (null | DBTrack)[] = results.items.map((item: PlaylistItem) => {
        const apiTrack: SpotifyObjects.Track | Episode = item.track;
        if (apiTrack.type === "episode")
        {
          // for now
          return null;
        }

        const partialTrack: PartialTrack = makePartialTrack(apiTrack);

        const dbTrack: DBTrack | null = this.loadPartialTrack(partialTrack,
                                                              "",
                                                              apiTrack.artists,
                                                              [playlist]);
        return dbTrack;
      });

      const tracks: DBTrack[] = (tracksEtc.filter((t) => t !== null)) as DBTrack[];

      playlist.track_ids.push(...tracks.map((track) => track.id));

      tracks.forEach((track: DBTrack) => {
        this.addOrUpdateTrack(track, {type: "playlist", id: playlist.id}, "");
      });


      this._currentPlaylistTotalTracks += results.items.length;

      if (this._currentPlaylistTotalTracks === results.total)
      {
        this._currentPlaylistTotalTracks = 0;
        if (playlistIndex == this._playlists.length - 1)
        {
          this.setStatus({status: "loading_artists"});
        }
        else
        {
          TrackLoaderController.log(`Increasing subprogress from ${this.status?.subprogress} by ${tracks.length} before going to next playlist`);
          this.setStatus({
                           ...this.status,
                           offset: 0,
                           limit: 100,
                           currentPlaylist: playlistIndex + 1,
                           subprogress: (this.status?.subprogress ?? 0) + tracks.length
                         });
        }
      }
      else
      {
        TrackLoaderController.log(`Increasing subprogress from ${this.status?.subprogress} by ${tracks.length}`);
        this.setStatus({
                         ...this.status,
                         offset: this.status?.offset! + results.items.length,
                         subprogress: this.status?.subprogress! + tracks.length,
                         currentPlaylist: playlistIndex
                       });
      }
    }
    catch (err)
    {
      this.setStatus({...this.status, status: "error", error: (err as Error).stack!});
    }
  }

  private async loadArtists(): Promise<void>
  {
    const artistIdChunks: string[][] = ArrayUtils.splitIntoChunks([...this._artistInclusionReasons.keys()], 20);
    const tracks: DBTrack[] = this.tracks;

    await Promise.all(artistIdChunks.map(async (ids: string[]) => {
      const artists: Array<SpotifyObjects.Artist | null> = await this.callSpotify(() => this.spotify.artists.getArtists(ids),
                                                                                  `Get artists ${ids.join(",")}`);
      artists.forEach((spotifyArtist: SpotifyObjects.Artist | null) => {
        if (spotifyArtist !== null)
        {
          const partialArtist: PartialArtist = makePartialArtist(spotifyArtist);
          const dbArtist: DBArtist = {
            ...partialArtist,
            inclusionReasons: this._artistInclusionReasons.get(partialArtist.id)!
          };

          this._artistsById.set(dbArtist.id, dbArtist);

          tracks.filter((track: DBTrack) => (track.artist_ids.has(dbArtist.id)))
                .forEach((track: DBTrack) => {
                  track.genres = new Set(dbArtist.genres);
                });
        }
      });
    }));

    this.setStatus({status: "saving_to_database"});
  }

  private async loadAlbumTracks(album: SpotifyObjects.Album, dbAlbum: DBAlbum): Promise<DBTrack[]>
  {
    const track_ids: string[] = [];
    const tracks: DBTrack[] = [];

    const loadTrackPage = async (page: Paging<SimplifiedTrack>) => {
      page.items.map((simplifiedTrack: SimplifiedTrack) => {
        track_ids.push(simplifiedTrack.id);

        const {artists, ...basicTrack} = {...simplifiedTrack};


        const partialTrack: PartialTrack = {
          ...basicTrack,
          external_ids: {},
          popularity: 0
        };

        const dbTrack: DBTrack | null = this.loadPartialTrack(partialTrack,
                                                              album.id,
                                                              album.artists,
                                                              [{type: "album", id: dbAlbum.id}]);
        if (dbTrack != null)
        {
          tracks.push(dbTrack);
        }
      });

      const next: string | null = page.next;

      if (!next)
      {
        return null;
      }


      const results: Paging<SimplifiedTrack> = await this.callSpotify(() => this.spotify.albums.getAlbumTracks(album.id,
                                                                                                               {
                                                                                                                 limit: page.limit,
                                                                                                                 offset: page.offset + page.limit
                                                                                                               }),
                                                                      `getAlbumTracks ${album.id} - ${page.offset + page.limit}`);

      return results;
    };

    const pages: Paging<SimplifiedTrack>[] = [];

    pages.push(album.tracks);
    await pMapSeries(pages,
                     async (page: Paging<SimplifiedTrack>) => {
                       const next: Paging<SimplifiedTrack> | null = await loadTrackPage(page);
                       if (next)
                       {
                         pages.push(next);
                       }
                     });

    dbAlbum.track_ids = track_ids;
    return tracks;
  }

  private createMissingArtists(allIds: string[], inclusionReasons: InclusionReason[]): void
  {
    allIds.forEach((id: string) => {
      const existingInclusionReasons: InclusionReason[] = this._artistInclusionReasons.get(id) ?? [];
      ArrayUtils.pushAllMissing(existingInclusionReasons, inclusionReasons);
      this._artistInclusionReasons.set(id, existingInclusionReasons);
    });
  }
}
