/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {TracksProvider} from "app/client/app/TracksProvider";
import {ITrack} from "app/client/model/Track";
import {AppServices} from "app/client/app/AppServices";
import {BrowserProvider} from "app/client/browser/Browser";
import {BrowserController} from "app/client/browser/BrowserController";


export class BrowserProviderFactory
{
  private constructor()
  {
    //
  }

  public static getProvider(path: string): BrowserProvider
  {
    let provider: BrowserProvider;
    let tracks: ITrack[] = [];

    provider = this.getProviderFromTracks("", tracks);
    tracks = provider.tracks;

    if (path !== "")
    {
      path.split(BrowserController.PATH_SEP).forEach((pathPart) => {
        provider = this.getProviderFromTracks(pathPart, tracks);
        tracks = provider.tracks;
      });
    }

    return provider;
  }

  private static getProviderFromTracks(pathPart: string, tracks: ITrack[]): BrowserProvider
  {
    if (pathPart === "")
    {
      return AppServices.dataStore;
    }
    else if (pathPart === "favorites")
    {
      return new TracksProvider(tracks.filter((track) => track.source === "favorite"));
    }
    else if (pathPart === "albums")
    {
      return new TracksProvider(tracks.filter((track) => track.album !== undefined));
    }
    else if (pathPart === "artists")
    {
      return new TracksProvider(tracks);
    }
    else if (pathPart === "genres")
    {
      return new TracksProvider(tracks);
    }
    else if (pathPart === "playlists")
    {
      return new TracksProvider(tracks.filter((track) => track.playlist !== undefined));
    }
    else if (pathPart === "tracks")
    {
      return new TracksProvider(tracks);
    }
    else
    {
      return AppServices.dataStore;
    }
  }
}