/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IAlbum} from "../model/Album";
import {IArtist} from "../model/Artist";
import {areGenresSame, IGenre} from "../model/Genre";
import {IPlaylist} from "../model/Playlist";
import {ITrack} from "../model/Track";
import {isTrackFavorite} from "app/client/model/TrackSource";
import {ArrayUtils} from "app/client/utils/ArrayUtils";
import {areIdentifiedObjectsSame, IdentifiedObject} from "app/client/model/IdentifiedObject";
import {BrowserObjectProvider, BrowserProvider} from "app/client/browser/Browser";
import {AppServices} from "app/client/app/AppServices";

export class PlaylistTracksProvider implements BrowserProvider, BrowserObjectProvider
{
  private _tracks: ITrack[];
  private _playlist: IPlaylist | undefined;

  constructor(tracks: ITrack[], id: string)
  {
    this._playlist = AppServices.dataStore.getPlaylist(id);
    this._tracks = tracks.filter((track) => track.playlists.map((p) => p.id).indexOf(id) !== -1);
  }

  get playlists(): IPlaylist[]
  {
    if (this._playlist)
    {
      return [this._playlist!];
    }

    return [];
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

  get playlist(): IPlaylist | undefined
  {
    return this._playlist;
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
    return this.playlist;
  }

  public getFavorites(): ITrack[]
  {
    return this._tracks.filter((track) => isTrackFavorite(track));
  }

}