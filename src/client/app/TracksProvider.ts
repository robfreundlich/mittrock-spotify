/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {BrowserProvider} from "app/client/browser/Browser";
import {IAlbum} from "../model/Album";
import {IArtist} from "../model/Artist";
import {areGenresSame, IGenre} from "../model/Genre";
import {IPlaylist} from "../model/Playlist";
import {ITrack} from "../model/Track";
import {ArrayUtils} from "app/client/utils/ArrayUtils";
import {areIdentifiedObjectsSame} from "app/client/model/IdentifiedObject";

export class TracksProvider implements BrowserProvider
{
  private _tracks: ITrack[];
  private _albums: IAlbum[];
  private _artists: IArtist[];
  private _genres: IGenre[];
  private _playlists: IPlaylist[];
  private _favorites: ITrack[]

  public constructor(tracks: ITrack[])
  {
    this._tracks = tracks;

    this._albums = this._tracks
      .filter((track: ITrack) => track.source === "album")
      .map((track: ITrack) => track.album)
      .filter((album: IAlbum | undefined) => album !== undefined) as IAlbum[];

    this._artists = [];

    this._tracks
      .map((track: ITrack) => track.artists)
      .forEach((artists: IArtist[]) => ArrayUtils.pushAllMissing(this._artists, artists, areIdentifiedObjectsSame));

    this._genres = [];

    this._tracks
      .map((track: ITrack) => track.genres)
      .forEach((genres: IGenre[]) => ArrayUtils.pushAllMissing(this._genres, genres, areGenresSame));
    
    this._playlists = this._tracks
      .filter((track: ITrack) => track.source === "playlist")
      .map((track: ITrack) => track.playlist)
      .filter((playlist: IPlaylist | undefined) => playlist !== undefined) as IPlaylist[];

    this._favorites = this._tracks
      .filter((track: ITrack) => track.source === "favorite");
  }

  get playlists(): IPlaylist[]
  {
    return this._playlists;
  }

  get genres(): IGenre[]
  {
    return this._genres;
  }

  get artists(): IArtist[]
  {
    return this._artists;
  }

  get albums(): IAlbum[]
  {
    return this._albums;
  }

  get tracks(): ITrack[]
  {
    return this._tracks;
  }

  public getFavorites(): ITrack[]
  {
    return this._favorites;
  }

}