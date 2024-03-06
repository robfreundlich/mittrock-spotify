/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IAlbum} from "../model/Album";
import {IArtist} from "../model/Artist";
import {IGenre} from "../model/Genre";
import {IPlaylist} from "../model/Playlist";
import {ITrack} from "../model/Track";
import {isTrackFavorite} from "app/client/model/TrackSource";
import {ArrayUtils} from "app/client/utils/ArrayUtils";
import {areIdentifiedObjectsSame, IdentifiedObject} from "app/client/model/IdentifiedObject";
import {BrowserObjectProvider, BrowserProvider, BrowserProviderType} from "app/client/browser/Browser";
import {AppServices} from "app/client/app/AppServices";

export class GenreTracksProvider implements BrowserProvider, BrowserObjectProvider
{
  public browserProviderType: BrowserProviderType = "genre";

  private _tracks: ITrack[];
  private _genre: IGenre | undefined;

  constructor(tracks: ITrack[], name: string)
  {
    this._genre = AppServices.dataStore.getGenre(name);
    this._tracks = tracks.filter((track) => track.genres.map((p) => p.name).indexOf(name) !== -1);
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

  get genres(): IGenre[]
  {
    if (this._genre)
    {
      return [this._genre];
    }

    return [];
  }

  get genre(): IGenre | undefined
  {
    return this._genre;
  }

  get albums(): IAlbum[]
  {
    const result: IAlbum[] = [];

    this._tracks
      .map((track) => track.album)
      .filter((album) => album !== undefined)
      .forEach((item) => ArrayUtils.pushIfMissing(result,
                                                  item!,
                                                  areIdentifiedObjectsSame));

    return result;
  }

  get tracks(): ITrack[]
  {
    return this._tracks;
  }

  getObject(): IdentifiedObject | IGenre | undefined
  {
    return this.genre;
  }

  public getFavorites(): ITrack[]
  {
    return this._tracks.filter((track) => isTrackFavorite(track));
  }
}