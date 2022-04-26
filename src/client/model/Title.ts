/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {Album} from "app/client/model/Album";
import {Artist} from "app/client/model/Artist";
import {areGenresSame, Genre} from "app/client/model/Genre";
import {areIdentifiedObjectsSame, IdentifiedObject} from "app/client/model/IdentifiedObject";
import {Track} from "app/client/model/Track";
import {ArrayUtils} from "app/client/utils/ArrayUtils";
import {Explicitness, TrackStorageOrigin} from "app/client/utils/Types";

/**
 * A title represents all <code>{@link Track}</code>s that have the same name.
 */
export class Title implements IdentifiedObject
{
  private _id: string;

  private _name: string;

  private _albums: Album[];

  private _genres: Genre[];

  private _artists: Artist[];

  private _explicits: Explicitness[];

  private _lengths: number[]; // second

  private _popularities: number[]; // integer 0 - 100

  private _locals: TrackStorageOrigin[];

  private _tracks: Track[];

  constructor(id: string,
              name: string,
              albums: Album[],
              genres: Genre[],
              artists: Artist[],
              explicits: Explicitness[],
              lengths: number[],
              popularities: number[],
              locals: TrackStorageOrigin[],
              tracks: Track[])
  {
    this._id = id;
    this._name = name;
    this._albums = albums;
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

  public get albums(): Album[]
  {
    return this._albums;
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
      ArrayUtils.pushIfMissing(this._albums, track.album, areIdentifiedObjectsSame);
      ArrayUtils.pushAllMissing(this._genres, track.genres, areGenresSame);
      ArrayUtils.pushAllMissing(this._artists, track.artists, areIdentifiedObjectsSame);
      ArrayUtils.pushIfMissing(this._explicits, track.explicit);
      ArrayUtils.pushIfMissing(this._lengths, track.length);
      ArrayUtils.pushIfMissing(this._popularities, track.popularity);
      ArrayUtils.pushIfMissing(this._locals, track.local);
    }
  }
}
