/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IAlbum} from "app/client/model/Album";
import {IArtist} from "app/client/model/Artist";
import {DataStore} from "app/client/model/DataStore";
import {Favorites} from "app/client/model/Favorites";
import {Genre} from "app/client/model/Genre";
import {ITrack, Track} from "app/client/model/Track";
import {ArrayUtils} from "app/client/utils/ArrayUtils";
import React from "react";
import {SpotifyWebApi} from "spotify-web-api-ts";
import * as SpotifyObjects from "spotify-web-api-ts/types/types/SpotifyObjects";
import {SavedAlbum, SavedTrack, SimplifiedTrack} from "spotify-web-api-ts/types/types/SpotifyObjects";
import {GetSavedAlbumsResponse, GetSavedTracksResponse} from "spotify-web-api-ts/types/types/SpotifyResponses";

type Status = {
  status: "unloaded" | "loading_favorites" | "loading_albums" | "loaded" | "error";
  offset?: number;
  subprogress?: number;
  error?: string;
}

export interface TrackLoaderProps
{
  authToken: string | undefined;

  dataStore: DataStore;
}

export class TrackLoader extends React.Component<TrackLoaderProps, Status>
{
  private loaderItemCount: number = 0;

  private spotify: SpotifyWebApi;

  constructor(props: Readonly<never>)
  {
    super(props);

    this.state = {status: "unloaded"};
  }

  public override render()
  {
    return <div className="track-loader">
      {this.getStatusContent()}
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

  private startLoading(): void
  {
    this.setState({status: "loading_favorites", offset: 0});
  };

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
  };

  private async loadFavorites(): Promise<void>
  {
    try
    {
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
        this.setState({status: "loading_albums", offset: 0, subprogress: 0});
      }
      else
      {
        this.setState({status: this.state.status, offset: this.state.offset! + results.items.length});
      }
    }
    catch (err)
    {
      this.setState({status: "error", error: (err as any).toString()});
    }
  };

  private async loadAlbums(): Promise<void>
  {
    try
    {
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
        this.setState({status: "loaded"});
      }
      else
      {
        this.setState({
                        status: this.state.status,
                        offset: this.state.offset! + results.items.length,
                        subprogress: this.state.subprogress! + tracks.length
                      });
      }
    }
    catch (err)
    {
      this.setState({status: "error", error: (err as any).toString()});
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
      artists: this.convertApiArtistsToArtists(apiAlbum.artists)
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

  private getStatusContent(): React.ReactNode
  {
    switch (this.state.status)
    {
      case "unloaded":
        return <button disabled={this.state.status !== "unloaded"}
                       onClick={() => this.startLoading()}>Click to begin loading</button>;

      case "loading_favorites":
        return `Loading Favorites. Loaded ${this.state.offset} tracks so far.`;

      case "loading_albums":
        return `Loading Albums. Loaded ${this.state.offset} albums with ${this.state.subprogress} tracks so far.`;

      case "loaded":
        return `Loaded ${this.props.dataStore.titles.length} titles for ${this.props.dataStore.tracks.length} tracks.`;

      case "error":
        return `Error loading tracks ${this.state.error}`;
    }
  };
}

