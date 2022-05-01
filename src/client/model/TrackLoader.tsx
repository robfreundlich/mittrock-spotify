/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {DataStoreContext, SpotifyApiContext} from "app/client/app/App";
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

export const TrackLoader = () => {
  const [status, setStatus] = React.useState<Status>({status: "unloaded"});

  const loaderItemCount: React.MutableRefObject<number> = React.useRef(0);

  var authToken: string = React.useContext(SpotifyApiContext);
  var dataStore: DataStore = React.useContext(DataStoreContext);

  var spotify = new SpotifyWebApi({accessToken: authToken});

  const startLoading = () => {
    setStatus({status: "loading_favorites", offset: 0});
  };

  function loadNext(): void
  {
    // window.requestAnimationFrame(() => {
    if (status.status === "loading_favorites")
    {
      loadFavorites();
    }
    else if (status.status === "loading_albums")
    {
      loadAlbums();
    }
    // });
  };

  const loadFavorites = async () => {
    try
    {
      const results: GetSavedTracksResponse = await spotify.library.getSavedTracks({limit: 50, offset: status.offset!});

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
                                       convertApiArtistsToArtists(apiTrack.artists),
                                       convertApiAlbumToIAlbum(apiTrack.album));

        track.artists.forEach((artist) => {
          artistIds.add(artist.id);
        });

        tracks.push(track);
      });

      loaderItemCount.current += results.items.length;

      const artistIdChunks: string[][] = ArrayUtils.splitIntoChunks([...artistIds], 20);

      await Promise.all(artistIdChunks.map(async (ids: string[]) => {
        const artists: Array<SpotifyObjects.Artist | null> = await spotify.artists.getArtists(ids);
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
        dataStore.addTrack(track);
      });

      if (loaderItemCount.current === results.total)
      {
        loaderItemCount.current = 0;
        setStatus({status: "loading_albums", offset: 0, subprogress: 0});
      }
      else
      {
        setStatus({status: status.status, offset: status.offset! + results.items.length});
      }
    }
    catch (err)
    {
      setStatus({status: "error", error: (err as any).toString()});
    }
  };

  const loadAlbums = async () => {
    try
    {
      const results: GetSavedAlbumsResponse = await spotify.library.getSavedAlbums({limit: 50, offset: status.offset!});

      const tracks: Track[] = [];

      results.items.forEach((result: SavedAlbum) => {
        const apiAlbum: SpotifyObjects.Album = result.album;
        const album: IAlbum = convertApiAlbumToIAlbum(apiAlbum);
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
                                         convertApiArtistsToArtists(apiTrack.artists));

          tracks.push(track);
        });
      });

      const allTrackIds: string[] = tracks.map((track: Track) => track.id);

      const trackIdChunks: string[][] = ArrayUtils.splitIntoChunks(allTrackIds, 20);

      await Promise.all(trackIdChunks.map(async (ids: string[]) => {
        const artists: Array<SpotifyObjects.Track | null> = await spotify.tracks.getTracks(ids);
        artists.forEach((apiTrack: SpotifyObjects.Track | null) => {
          if (apiTrack !== null)
          {
            tracks.filter((track: ITrack) => track.id === apiTrack.id)[0].popularity = apiTrack.popularity;
          }
        });
      }));

      tracks.forEach((track: Track) => {
        dataStore.addTrack(track);
      });

      loaderItemCount.current += results.items.length;

      if (loaderItemCount.current === results.total)
      {
        setStatus({status: "loaded"});
      }
      else
      {
        setStatus({
                    status: status.status,
                    offset: status.offset! + results.items.length,
                    subprogress: status.subprogress! + tracks.length
                  });
      }
    }
    catch (err)
    {
      setStatus({status: "error", error: (err as any).toString()});
    }
  };


  const convertApiAlbumToIAlbum = (apiAlbum: SpotifyObjects.SimplifiedAlbum) => {
    const album: IAlbum = {
      id: apiAlbum.id,
      name: apiAlbum.name,
      type: apiAlbum.type,
      tracks: [],
      releaseDate: apiAlbum.release_date,
      releaseDatePrecision: apiAlbum.release_date_precision,
      artists: convertApiArtistsToArtists(apiAlbum.artists)
    };

    return album;
  };

  const convertApiArtistsToArtists = (apiArtists: SpotifyObjects.SimplifiedArtist[]) => {
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

  const getStatusContent = () => {
    switch (status.status)
    {
      case "unloaded":
        return <button disabled={status.status !== "unloaded"}
                       onClick={startLoading}>Click to begin loading</button>;

      case "loading_favorites":
        return `Loading Favorites. Loaded ${status.offset} tracks so far.`;

      case "loading_albums":
        return `Loading Albums. Loaded ${status.offset} albums with ${status.subprogress} tracks so far.`;

      case "loaded":
        return `Loaded ${dataStore.titles.length} titles for ${dataStore.tracks.length} tracks.`;

      case "error":
        return `Error loading tracks ${status.error}`;
    }
  };

  React.useEffect(() => {
    loadNext();
  }, [status]);

  return <div className="track-loader">
    {getStatusContent()}
  </div>;
};
