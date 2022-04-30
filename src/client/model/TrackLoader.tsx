/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {DataStoreContext, SpotifyApiContext} from "app/client/app/App";
import {IAlbum} from "app/client/model/Album";
import {IArtist} from "app/client/model/Artist";
import {DataStore} from "app/client/model/DataStore";
import {Genre} from "app/client/model/Genre";
import {ITrack, Track} from "app/client/model/Track";
import React from "react";
import {SpotifyWebApi} from "spotify-web-api-ts";
import * as SpotifyObjects from "spotify-web-api-ts/types/types/SpotifyObjects";
import {SavedTrack} from "spotify-web-api-ts/types/types/SpotifyObjects";
import {GetSavedTracksResponse} from "spotify-web-api-ts/types/types/SpotifyResponses";

export const TrackLoader = () => {
  const [status, setStatus] = React.useState<"unloaded" | "loading" | "loaded" | "error">("unloaded");
  const [error, setError] = React.useState();
  const [offset, setOffset] = React.useState(0);

  var authToken: string = React.useContext(SpotifyApiContext);
  var dataStore: DataStore = React.useContext(DataStoreContext);

  var spotify = new SpotifyWebApi({accessToken: authToken});

  const startLoading = () => {
    setStatus("loading");

    loadNextBatch();
  };

  const loadNextBatch = async () => {
    try
    {
      const results: GetSavedTracksResponse = await spotify.library.getSavedTracks({limit: 50, offset: offset});

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
                                       convertApiAlbumToIAlbum(apiTrack.album),
                                       [],  // TODO: Need to backfill genres
                                       convertApiArtistsToArtists(apiTrack.artists));

        track.artists.forEach((artist) => {
          artistIds.add(artist.id);
        });

        tracks.push(track);
      });

      const allArtistIds: string[] = [...artistIds];
      const artistIdChunks: string[][] = [];
      while (allArtistIds.length !== 0)
      {
        artistIdChunks.push(allArtistIds.splice(0, 20));
      }

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

      if (dataStore.tracks.length === results.total)
      {
        setStatus("loaded");
      }
      else
      {
        setOffset(offset + results.items.length);
      }
    }
    catch (err)
    {
      setError((err as any).toString());
      setStatus("error");
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
    switch (status)
    {
      case "unloaded":
        return <button disabled={status !== "unloaded"}
                       onClick={startLoading}>Click to begin loading</button>;

      case "loading":
        loadNextBatch();
        return `Loading. Loaded ${offset} tracks so far.`;

      case "loaded":
        return `Loaded ${dataStore.tracks.length} tracks.`;

      case "error":
        return `Error loading tracks ${error}`;
    }
  };

  return <div className="track-loader">
    {getStatusContent()}
  </div>;
};
