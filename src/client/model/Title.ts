/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {Album} from "client/model/Album";
import {Artist} from "client/model/Artist";
import {Genre} from "client/model/Genre";
import {areIdentifiedObjectsSame, IdentifiedObject} from "client/model/IdentifiedObject";
import {Track} from "client/model/Track";
import {ArrayUtils} from "client/utils/ArrayUtils";
import {Explicitness, TrackStorageOrigin} from "client/utils/Types";

/**
 * A title represents all <code>{@link Track}</code>s that have the same name.
 */
export class Title implements IdentifiedObject
{
  private _id: string;

  private _name: string;

  private _album: Album[];

  private _genres: Genre[];

  private _artists: Artist[];

  private _explicits: Explicitness[];

  private _lengths: number[]; // second

  private _popularities: number[]; // integer 0 - 100

  private _locals: TrackStorageOrigin[];

  private _tracks: Track[];

  constructor(name: string,
              album: Album[],
              genres: Genre[],
              artists: Artist[],
              explicits: Explicitness[],
              lengths: number[],
              popularities: number[],
              locals: TrackStorageOrigin[],
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

  public get id(): string
  {
    return this._id;
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

  public get explicits(): Explicitness[]
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

  public get locals(): TrackStorageOrigin[]
  {
    return this._locals;
  }

  public get tracks(): Track[]
  {
    return this._tracks;
  }

  public addTrack(track: Track): void
  {
    if (ArrayUtils.pushIfMissing(this._tracks, track, areIdentifiedObjectsSame))
    {
      ArrayUtils.pushAllMissing(this._genres, track.genres, areIdentifiedObjectsSame);
      ArrayUtils.pushAllMissing(this._artists, track.artists, areIdentifiedObjectsSame);
      ArrayUtils.pushIfMissing(this._explicits, track.explicit);
      ArrayUtils.pushIfMissing(this._lengths, track.length);
      ArrayUtils.pushIfMissing(this._popularities, track.popularity);
      ArrayUtils.pushIfMissing(this._locals, track.local);
    }
  }
}
