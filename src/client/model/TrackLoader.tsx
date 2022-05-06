/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IAlbum} from "app/client/model/Album";
import {IArtist} from "app/client/model/Artist";
import {DataStore} from "app/client/model/DataStore";
import {Favorites} from "app/client/model/Favorites";
import {Genre} from "app/client/model/Genre";
import {IPlaylist} from "app/client/model/Playlist";
import {ITrack, Track} from "app/client/model/Track";
import {ArrayUtils} from "app/client/utils/ArrayUtils";
import {TimeUtils} from "app/client/utils/TimeUtils";
import React from "react";
import {SpotifyWebApi} from "spotify-web-api-ts";
import * as SpotifyObjects from "spotify-web-api-ts/types/types/SpotifyObjects";
import {Episode, Playlist, PlaylistItem, SavedAlbum, SavedTrack, SimplifiedPlaylist, SimplifiedTrack} from "spotify-web-api-ts/types/types/SpotifyObjects";
import {
  GetMyPlaylistsResponse,
  GetPlaylistItemsResponse,
  GetSavedAlbumsResponse,
  GetSavedTracksResponse
} from "spotify-web-api-ts/types/types/SpotifyResponses";

type Status = {
  status: "unloaded" | "loading_favorites" | "loading_albums" | "loading_playlists" | "loading_playlist_tracks" | "loaded" | "error" | "stopped";
  offset?: number;
  subprogress?: number;
  error?: string;
  currentPlaylist?: number;
  currentTime: Date;
}

export interface TrackLoaderProps
{
  authToken: string | undefined;

  dataStore: DataStore;
}

export class TrackLoader extends React.Component<TrackLoaderProps, Status>
{
  private static apiDelay(condition: boolean): Promise<void>
  {
    return TimeUtils.delay(100, condition);
  }

  private loaderItemCount: number = 0;

  private spotify: SpotifyWebApi;

  private _playlists: IPlaylist[] = [];

  private _currentPlaylistTotalTracks: number;

  private _startTime: number;

  constructor(props: Readonly<never>)
  {
    super(props);

    this.state = {status: "unloaded", currentTime: new Date()};
  }

  public override render()
  {
    if (this.state.status === "unloaded")
    {
      return <button disabled={this.state.status !== "unloaded"}
                     onClick={() => this.startLoading()}>Click to begin loading</button>;
    }

    return <div className="track-loader">

      <button onClick={() => this.state = {status: "stopped", currentTime: new Date()}}>Stop</button>

      <div className="progress">

        {(this.state.status === "error") && <div className="error-container container">
          <div className="error-label label">Error</div>
          <textarea className="error-content data">${this.state.error}</textarea>
        </div>}

        <div className="favorites-container container item">
          <div className="label">Favorites</div>
          <div className="data">{this.props.dataStore.numFavoriteTracks}</div>
        </div>

        <div className="albums-container container">
          <div className="albums item">
            <div className="label">Albums</div>
            <div className="data">{this.props.dataStore.albums.length}</div>
          </div>
          <div className="tracks item">
            <div className="label">Tracks</div>
            <div className="data">{this.props.dataStore.numAlbumTracks}</div>
          </div>
        </div>

        <div className="playlists-container container">
          <div className="playlists item">
            <div className="label">Playlists</div>
            <div className="data">{this.props.dataStore.playlists.length}</div>
          </div>
          <div className="tracks item">
            <div className="label">Tracks</div>
            <div className="data">{this.props.dataStore.numPlaylistTracks}</div>
          </div>
        </div>

        <div className="totals-container container">
          <div className="total-tracks item">
            <div className="label">Total tracks</div>
            <div className="data">{this.props.dataStore.tracks.length}</div>
          </div>
          <div className="elapsed-time item">
            <div className="label">Elapsed time</div>
            <div className="data">{TimeUtils.getElapsedTime(this._startTime, this.state.currentTime)}</div>
          </div>
        </div>
      </div>
    </div>;
  }

  public override componentDidMount(): void
  {
    this.updateFromStateAndProps();
  }

  public override componentDidUpdate(prevProps: Readonly<TrackLoaderProps>, prevState: Readonly<Status>): void
  {
    this.updateFromStateAndProps(prevProps, prevState);
  }

  private updateFromStateAndProps(prevProps?: Readonly<TrackLoaderProps>, prevState?: Readonly<Status>): void
  {
    if (this.props.authToken)
    {
      if (prevProps?.authToken !== this.props.authToken)
      {
        this.spotify = new SpotifyWebApi({accessToken: this.props.authToken});
      }
    }

    if ((prevState === undefined) || (JSON.stringify(prevState) !== JSON.stringify(this.state)))
    {
      this.loadNext();
    }
  }

  private loadNext(): void
  {
    if (this.state.status === "loading_favorites")
    {
      this.loadFavorites();
    }
    else if (this.state.status === "loading_albums")
    {
      this.loadAlbums();
    }
    else if (this.state.status === "loading_playlists")
    {
      this.loadPlaylists();
    }
    else if (this.state.status === "loading_playlist_tracks")
    {
      this.loadPlaylistTracks(this.state.currentPlaylist);
    }
  };

  private startLoading(): void
  {
    this._startTime = new Date().getTime();
    this.setState({status: "loading_favorites", offset: 0, subprogress: 0});
  };

  private async loadFavorites(): Promise<void>
  {
    try
    {
      await TrackLoader.apiDelay(this.state.offset! > 0);
      const results: GetSavedTracksResponse = await this.spotify.library.getSavedTracks({limit: 50, offset: this.state.offset!});

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
                                       this.convertApiAlbumToIAlbum(apiTrack.album));

        track.artists.forEach((artist) => {
          artistIds.add(artist.id);
        });

        tracks.push(track);
      });

      this.loaderItemCount += results.items.length;

      const artistIdChunks: string[][] = ArrayUtils.splitIntoChunks([...artistIds], 20);

      await Promise.all(artistIdChunks.map(async (ids: string[]) => {
        await TrackLoader.apiDelay(true);
        const artists: Array<SpotifyObjects.Artist | null> = await this.spotify.artists.getArtists(ids);
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
        this.props.dataStore.addTrack(track);
      });

      if (this.loaderItemCount === results.total)
      {
        this.loaderItemCount = 0;
        this.setState({status: "loading_albums", offset: 0, subprogress: 0, currentTime: new Date()});
      }
      else
      {
        this.setState({status: this.state.status, offset: this.state.offset! + results.items.length, currentTime: new Date()});
      }
    }
    catch (err)
    {
      this.setState({status: "error", error: (err as Error).stack!, currentTime: new Date()});
    }
  };

  private async loadAlbums(): Promise<void>
  {
    try
    {
      await TrackLoader.apiDelay(this.state.offset! > 0);
      const results: GetSavedAlbumsResponse = await this.spotify.library.getSavedAlbums({limit: 50, offset: this.state.offset!});

      const tracks: Track[] = [];

      results.items.forEach((result: SavedAlbum) => {
        const apiAlbum: SpotifyObjects.Album = result.album;
        const album: IAlbum = this.convertApiAlbumToIAlbum(apiAlbum);
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
        await TrackLoader.apiDelay(true);
        const artists: Array<SpotifyObjects.Track | null> = await this.spotify.tracks.getTracks(ids);
        artists.forEach((apiTrack: SpotifyObjects.Track | null) => {
          if (apiTrack !== null)
          {
            tracks.filter((track: ITrack) => track.id === apiTrack.id)[0].popularity = apiTrack.popularity;
          }
        });
      }));

      tracks.forEach((track: Track) => {
        this.props.dataStore.addTrack(track);
      });

      this.loaderItemCount += results.items.length;

      if (this.loaderItemCount === results.total)
      {
        this.loaderItemCount = 0;
        this.setState({status: "loading_playlists", offset: 0, subprogress: 0, currentTime: new Date()});
      }
      else
      {
        this.setState({
                        status: this.state.status,
                        offset: this.state.offset! + results.items.length,
                        subprogress: this.state.subprogress! + tracks.length,
                        currentTime: new Date()
                      });
      }
    }
    catch (err)
    {
      this.setState({status: "error", error: (err as Error).stack!, currentTime: new Date()});
    }
  }

  private async loadPlaylists(): Promise<void>
  {
    try
    {
      await TrackLoader.apiDelay(this.state.offset! > 0);
      const results: GetMyPlaylistsResponse = await this.spotify.playlists.getMyPlaylists({limit: 50, offset: this.state.offset!});

      await Promise.all(results.items.map((async (result: SimplifiedPlaylist) => {
        const apiPlaylist: Playlist = await this.spotify.playlists.getPlaylist(result.id);
        await TrackLoader.apiDelay(true);
        const playlist: IPlaylist = this.convertApiPlaylistToIPlaylist(apiPlaylist);

        this._playlists.push(playlist);
      })));

      this.loaderItemCount += results.items.length;

      if (this.loaderItemCount === results.total)
      {
        this.loaderItemCount = 0;
        this.setState({status: "loading_playlist_tracks", offset: 0, subprogress: 0, currentTime: new Date()});
      }
      else
      {
        this.setState({
                        status: this.state.status,
                        offset: this.state.offset! + results.items.length,
                        currentTime: new Date()
                      });
      }
    }
    catch (err)
    {
      this.setState({status: "error", error: (err as Error).stack!, currentTime: new Date()});
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

      await TrackLoader.apiDelay(this.state.offset! > 0);
      const results: GetPlaylistItemsResponse = await this.spotify.playlists.getPlaylistItems(playListId, {limit: 100, offset: this.state.offset!});
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
        this.props.dataStore.addTrack(track);
      });

      this._currentPlaylistTotalTracks += results.items.length;

      if (this._currentPlaylistTotalTracks === results.total)
      {
        this._currentPlaylistTotalTracks = 0;
        if (playlistIndex == this._playlists.length - 1)
        {
          this.setState({status: "loaded", currentTime: new Date()});
        }
        else
        {
          this.setState({
                          status: this.state.status,
                          offset: 0,
                          subprogress: this.state.subprogress!,
                          currentPlaylist: playlistIndex + 1,
                          currentTime: new Date()
                        });
        }
      }
      else
      {
        this.setState({
                        status: this.state.status,
                        offset: this.state.offset! + results.items.length,
                        subprogress: this.state.subprogress! + tracks.length,
                        currentTime: new Date()
                      });
      }
    }
    catch (err)
    {
      this.setState({status: "error", error: (err as Error).stack!, currentTime: new Date()});
    }
  }

  private convertApiAlbumToIAlbum(apiAlbum: SpotifyObjects.SimplifiedAlbum): IAlbum
  {
    const album: IAlbum = {
      id: apiAlbum.id,
      name: apiAlbum.name,
      type: apiAlbum.type,
      tracks: [],
      releaseDate: apiAlbum.release_date,
      releaseDatePrecision: apiAlbum.release_date_precision,
      artists: this.convertApiArtistsToArtists(apiAlbum.artists),
      sourceType: "album"
    };

    return album;
  };

  private convertApiPlaylistToIPlaylist(apiPlaylist: SpotifyObjects.Playlist): IPlaylist
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

