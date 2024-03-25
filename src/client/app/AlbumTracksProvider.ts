/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IAlbum} from "../model/Album";
import {IArtist} from "../model/Artist";
import {areGenresSame, IGenre} from "../model/Genre";
import {IPlaylist} from "../model/Playlist";
import {ITrack} from "../model/Track";
import {isObjectFavorite} from "app/client/model/TrackSource";
import {ArrayUtils} from "app/client/utils/ArrayUtils";
import {areIdentifiedObjectsSame, IdentifiedObject} from "app/client/model/IdentifiedObject";
import {
  AllTracksProvider,
  BrowserObjectProvider,
  BrowserProvider,
  BrowserProviderType
} from "app/client/browser/Browser";
import {AppServices} from "app/client/app/AppServices";

export class AlbumTracksProvider implements BrowserProvider, BrowserObjectProvider, AllTracksProvider
{
  public browserProviderType: BrowserProviderType = "album";

  private _tracks: ITrack[];
  private _album: IAlbum | undefined;

  public readonly compareTracks = (a: ITrack, b: ITrack) => {
    if (a.disc_number === b.disc_number)
    {
      return a.track_number - b.track_number;
    }

    return a.disc_number - b.disc_number;
  };

  constructor(tracks: ITrack[], id: string)
  {
    this._album = AppServices.dataStore.getAlbum(id);
    this._tracks = tracks.filter((track) => track.album?.id === id);
  }

  get playlists(): IPlaylist[]
  {
    const result: IPlaylist[] = [];

    this._tracks
      .map((track) => track.playlists)
      .forEach((items) => ArrayUtils.pushAllMissing(result,
                                                    items,
                                                    areIdentifiedObjectsSame));

    return result;
  }

  get genres(): IGenre[]
  {
    const result: IGenre[] = [];

    this._tracks
      .map((track) => track.genres)
      .forEach((items) => ArrayUtils.pushAllMissing(result,
                                                    items,
                                                    areGenresSame));

    return result;
  }

  get artists(): IArtist[]
  {
    const result: IArtist[] = [];

    this._tracks
      .map((track) => track.artists)
      .forEach((items) => ArrayUtils.pushAllMissing(result,
                                                    items,
                                                    areIdentifiedObjectsSame));

    return result;
  }

  get album(): IAlbum | undefined
  {
    return this._album;
  }

  get albums(): IAlbum[]
  {
    if (this._album)
    {
      return [this._album];
    }

    return [];
  }

  get tracks(): ITrack[]
  {
    return this._tracks;
  }

  getObject(): IdentifiedObject | IGenre | undefined
  {
    return this.album;
  }

  public getFavorites(): ITrack[]
  {
    return this._tracks.filter((track) => isObjectFavorite(track));
  }

  public getAllTracks(): ITrack[]
  {
    let tracks: ITrack[] = (this.album?.tracks ?? []).slice();

    tracks = tracks.sort(this.compareTracks);

    return tracks;
  }
}