/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {Album} from "client/model/Album";
import {Artist} from "client/model/Artist";
import {Genre} from "client/model/Genre";

/**
 * A Track represents a single instance of a song (or whatever)
 */
export class Track
{
  private _name: string;

  private _explicit: boolean;

  private _length: number; // seconds

  private _popularity: number; // integer 0 - 100

  private _local: boolean;

  private _discNumber: number;

  private _trackNumber: number;

  private _album: Album;

  private _genres: Genre[];

  private _artists: Artist[];

  constructor(name: string,
              explicit: boolean,
              length: number,
              popularity: number,
              local: boolean,
              discNumber: number,
              trackNumber: number,
              album: Album,
              genres: Genre[],
              artists: Artist[])
  {
    this._name = name;
    this._explicit = explicit;
    this._length = length;
    this._popularity = popularity;
    this._local = local;
    this._discNumber = discNumber;
    this._trackNumber = trackNumber;
    this._album = album;
    this._genres = genres;
    this._artists = artists;
  }

  public get name(): string
  {
    return this._name;
  }

  public get explicit(): boolean
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

  public get local(): boolean
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
