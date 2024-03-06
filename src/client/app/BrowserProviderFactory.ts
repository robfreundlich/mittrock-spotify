/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {TracksProvider} from "app/client/app/TracksProvider";
import {ITrack} from "app/client/model/Track";
import {AppServices} from "app/client/app/AppServices";
import {BrowserProvider} from "app/client/browser/Browser";
import {BrowserController} from "app/client/browser/BrowserController";
import {isTrackFavorite} from "app/client/model/TrackSource";
import {AlbumTracksProvider} from "app/client/app/AlbumTracksProvider";
import {PlaylistTracksProvider} from "app/client/app/PlaylistTracksProvider";
import {ArtistTracksProvider} from "app/client/app/ArtistTracksProvider";
import {GenreTracksProvider} from "app/client/app/GenreTracksProvider";


export class BrowserProviderFactory
{
  public static getProviders(path: string): BrowserProvider[]
  {
    const providers: BrowserProvider[] = [];
    let provider: BrowserProvider;
    let tracks: ITrack[] = [];

    provider = this.getProviderFromTracks("", tracks);
    providers.push(provider);
    tracks = provider.tracks;

    if (path !== "")
    {
      path.split(BrowserController.PATH_SEP).forEach((pathPart) => {
        provider = this.getProviderFromTracks(pathPart, tracks);
        providers.push(provider);
        tracks = provider.tracks;
      });
    }

    return providers;
  }

  private static getProviderFromTracks(pathPart: string, tracks: ITrack[]): BrowserProvider
  {
    if (pathPart === "")
    {
      return AppServices.dataStore;
    }
    else if (pathPart === "favorites")
    {
      return new TracksProvider("favorites", tracks.filter((track) => isTrackFavorite(track)));
    }
    else if (pathPart === "albums")
    {
      return new TracksProvider("albums", tracks.filter((track) => track.album !== undefined));
    }
    else if (pathPart.split(BrowserController.PART_SEP)[0] == "album")
    {
      return new AlbumTracksProvider(tracks, pathPart.split(BrowserController.PART_SEP)[1]);
    }
    else if (pathPart === "artists")
    {
      return new TracksProvider("artists", tracks);
    }
    else if (pathPart.split(BrowserController.PART_SEP)[0] == "artist")
    {
      return new ArtistTracksProvider(tracks, pathPart.split(BrowserController.PART_SEP)[1]);
    }
    else if (pathPart === "genres")
    {
      return new TracksProvider("genres", tracks);
    }
    else if (pathPart.split(BrowserController.PART_SEP)[0] == "genre")
    {
      return new GenreTracksProvider(tracks, pathPart.split(BrowserController.PART_SEP)[1]);
    }
    else if (pathPart === "playlists")
    {
      return new TracksProvider("playlists", tracks.filter((track) => track.playlists.length > 0));
    }
    else if (pathPart.split(BrowserController.PART_SEP)[0] == "playlist")
    {
      return new PlaylistTracksProvider(tracks, pathPart.split(BrowserController.PART_SEP)[1]);
    }
    else if (pathPart === "tracks")
    {
      return new TracksProvider("tracks", tracks);
    }
    else
    {
      return AppServices.dataStore;
    }
  }
}