/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {Album} from "app/client/model/Album";
import {Artist} from "app/client/model/Artist";
import {Genre} from "app/client/model/Genre";
import {IdentifiedObject} from "app/client/model/IdentifiedObject";
import {Explicitness, TrackStorageOrigin} from "app/client/utils/Types";

/**
 * A Track represents a single instance of a song (or whatever)
 */
export class Track implements IdentifiedObject
{
  private _id: string;

  private _name: string;

  private _explicit: Explicitness;

  private _length: number; // seconds

  private _popularity: number; // integer 0 - 100

  private _local: TrackStorageOrigin;

  private _discNumber: number;

  private _trackNumber: number;

  private _album: Album;

  private _genres: Genre[];

  private _artists: Artist[];

  constructor(id: string,
              name: string,
              explicit: Explicitness,
              length: number,
              popularity: number,
              local: TrackStorageOrigin,
              discNumber: number,
              trackNumber: number,
              album: Album,
              genres: Genre[],
              artists: Artist[])
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

  public get album(): Album
  {
    return this._album;
  }

  public get genres(): Genre[]
  {
    return this._genres;
  }

  public get artists(): Artist[]
  {
    return this._artists;
  }
}
