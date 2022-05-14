/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {AppServices} from "app/client/app/AppServices";
import {IAlbum} from "app/client/model/Album";
import {IArtist} from "app/client/model/Artist";
import {ITrack} from "app/client/model/Track";
import React from "react";
import {SpotifyWebApi} from "spotify-web-api-ts";
import * as SpotifyObjects from "spotify-web-api-ts/types/types/SpotifyObjects";
import {SavedTrack} from "spotify-web-api-ts/types/types/SpotifyObjects";
import {GetSavedTracksResponse} from "spotify-web-api-ts/types/types/SpotifyResponses";

export interface DBTrackLoaderProps
{
  authToken: string | undefined;
}

export const DBTrackLoader = (props: DBTrackLoaderProps) => {

  const [status, setStatus] = React.useState<"unloaded" | "loading" | "loaded" | "error">("unloaded");
  const [tracks, setTracks] = React.useState(0);
  const [error, setError] = React.useState();

  const startLoading = async () => {
    setStatus("loading");

    if (!props.authToken)
    {
      return;
    }

    var spotify: SpotifyWebApi = new SpotifyWebApi({accessToken: props.authToken});

    try
    {
      const results: GetSavedTracksResponse = await spotify.library.getSavedTracks({limit: 50});
      results.items.forEach((result: SavedTrack, index: number) => {
        const apiTrack: SpotifyObjects.Track = result.track;

        const dbTrack: ITrack = {
          playlist: undefined,
          source: "favorite",
          id: apiTrack.id,
          name: apiTrack.name,
          local: "streaming",
          explicit: apiTrack.explicit ? "explicit" : "clean",
          length: apiTrack.duration_ms * 1000,
          popularity: apiTrack.popularity,
          discNumber: apiTrack.disc_number,
          trackNumber: apiTrack.track_number,
          album: convertApiAlbumToIAlbum(apiTrack.album),
          genres: [],
          artists: convertApiArtistsToArtists(apiTrack.artists)
        };

        setTracks(index);
        AppServices.db.tracks.add(dbTrack);
      });

      setStatus("loaded");
    }
    catch (err)
    {
      setError((err as any).toString());
      setStatus("error");
    }
  };

  const convertApiAlbumToIAlbum = (apiAlbum: SpotifyObjects.SimplifiedAlbum) => {
    const dbAlbum: IAlbum = {
      id: apiAlbum.id,
      name: apiAlbum.name,
      type: apiAlbum.type,
      tracks: [],
      releaseDate: apiAlbum.release_date,
      releaseDatePrecision: apiAlbum.release_date_precision,
      artists: convertApiArtistsToArtists(apiAlbum.artists),
      sourceType: "album",
    };

    return dbAlbum;
  };

  const convertApiArtistsToArtists = (apiArtists: SpotifyObjects.SimplifiedArtist[]) => {
    const dbArtists: IArtist[] = apiArtists.map((apiArtist: SpotifyObjects.SimplifiedArtist) => {
      const dbArtist: IArtist = {
        id: apiArtist.id,
        name: apiArtist.name,
        genres: [],
        popularity: 0
      };

      return dbArtist;
    });

    return dbArtists;
  };

  const getStatusContent = () => {
    switch (status)
    {
      case "unloaded":
        return <button disabled={status !== "unloaded"}
                       onClick={startLoading}>Click to begin loading</button>;

      case "loading":
        return `Loading. Loaded ${tracks} tracks so far.`;

      case "loaded":
        return `Loaded ${tracks} tracks.`;

      case "error":
        return `Error loading tracks ${error}`;
    }
  };

  return <div className="track-loader">
    {getStatusContent()}
  </div>;
};
