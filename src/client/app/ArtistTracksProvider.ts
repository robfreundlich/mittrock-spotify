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
import {BrowserObjectProvider, BrowserProvider, BrowserProviderType} from "app/client/browser/Browser";
import {AppServices} from "app/client/app/AppServices";

export class ArtistTracksProvider implements BrowserProvider, BrowserObjectProvider
{
  public browserProviderType: BrowserProviderType = "artist";

  private _tracks: ITrack[];
  private _artist: IArtist | undefined;

  constructor(tracks: ITrack[], id: string)
  {
    this._artist = AppServices.dataStore.getArtist(id);
    this._tracks = tracks.filter((track) => track.artists.map((p) => p.id).indexOf(id) !== -1);
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
    if (this._artist)
    {
      return [this._artist];
    }

    return [];
  }

  get artist(): IArtist | undefined
  {
    return this._artist;
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
    return this.artist;
  }

  public getFavorites(): ITrack[]
  {
    return this._tracks.filter((track) => isObjectFavorite(track));
  }
}