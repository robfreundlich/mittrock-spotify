/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {Album} from "client/model/Album";
import {Artist} from "client/model/Artist";
import {Genre} from "client/model/Genre";
import {Track} from "client/model/Track";

/**
 * A title represents all <code>{@link Track}</code>s that have the same name.
 */
export class Title
{
  private _name: string;

  private _album: Album[];

  private _genres: Genre[];

  private _artists: Artist[];

  private _explicits: boolean[];

  private _lengths: number[]; // seconds

  private _popularities: number[]; // integer 0 - 100

  private _locals: boolean[];

  private _tracks: Track[];

  constructor(name: string,
              album: Album[],
              genres: Genre[],
              artists: Artist[],
              explicits: boolean[],
              lengths: number[],
              popularities: number[],
              locals: boolean[],
              tracks: Track[])
  {
    this._name = name;
    this._album = album;
    this._genres = genres;
    this._artists = artists;
    this._explicits = explicits;
    this._lengths = lengths;
    this._popularities = popularities;
    this._locals = locals;
    this._tracks = tracks;
  }

  public get name(): string
  {
    return this._name;
  }

  public get album(): Album[]
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

  public get explicits(): boolean[]
  {
    return this._explicits;
  }

  public get lengths(): number[]
  {
    return this._lengths;
  }

  public get popularities(): number[]
  {
    return this._popularities;
  }

  public get locals(): boolean[]
  {
    return this._locals;
  }

  public get tracks(): Track[]
  {
    return this._tracks;
  }
}
