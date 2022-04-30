/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IAlbum} from "app/client/model/Album";
import {IArtist} from "app/client/model/Artist";
import {IGenre} from "app/client/model/Genre";
import {IdentifiedObject} from "app/client/model/IdentifiedObject";
import {Explicitness, TrackStorageOrigin} from "app/client/utils/Types";

export interface ITrack extends IdentifiedObject
{
  id: string;

  name: string;

  explicit: "explicit" | "clean";

  length: number;

  popularity: number;

  local: "local" | "streaming";

  discNumber: number;

  trackNumber: number;

  album: IAlbum;

  genres: IGenre[];

  artists: IArtist[];
}

/**
 * A Track represents a single instance of a song (or whatever)
 */
export class Track implements ITrack
{
  public _id: string;

  private _name: string;

  private _explicit: Explicitness;

  private _length: number; // seconds

  private _popularity: number; // integer 0 - 100

  private _local: TrackStorageOrigin;

  private _discNumber: number;

  private _trackNumber: number;

  private _album: IAlbum;

  private _genres: IGenre[];

  private _artists: IArtist[];

  constructor(id: string,
              name: string,
              explicit: Explicitness,
              length: number,
              popularity: number,
              local: TrackStorageOrigin,
              discNumber: number,
              trackNumber: number,
              album: IAlbum,
              genres: IGenre[],
              artists: IArtist[])
  {
    this._id = id;
    this._name = name;
    this._explicit = explicit;
    this._length = length;
    this._popularity = popularity;
    this._local = local;
    this._discNumber = discNumber;
    this._trackNumber = trackNumber;
    this._album = album;
    this._genres = genres.slice();
    this._artists = artists.slice();
  }

  public get id(): string
  {
    return this._id;
  }

  public get name(): string
  {
    return this._name;
  }

  public get explicit(): Explicitness
  {
    return this._explicit;
  }

  public get length(): number
  {
    return this._length;
  }

  public get popularity(): number
  {
    return this._popularity;
  }

  public get local(): TrackStorageOrigin
  {
    return this._local;
  }

  public get discNumber(): number
  {
    return this._discNumber;
  }

  public get trackNumber(): number
  {
    return this._trackNumber;
  }

  public get album(): IAlbum
  {
    return this._album;
  }

  public get genres(): IGenre[]
  {
    return this._genres;
  }

  public set genres(value: IGenre[])
  {
    this._genres = value;
  }

  public get artists(): IArtist[]
  {
    return this._artists;
  }
}
