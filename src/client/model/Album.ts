/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {Artist} from "client/model/Artist";
import {IdentifiedObject} from "client/model/IdentifiedObject";
import {Track} from "client/model/Track";
import {AlbumType, ReleaseDataPrecision} from "client/utils/Types";

export class Album implements IdentifiedObject
{
  private _id: string;

  private _name: string;

  private _type: AlbumType;

  private _tracks: Track[];

  private _releaseDate: string;  // Format: "YYYY", "YYYY-MM", "YYYY-MM-DD"

  private _releaseDatePrecision: ReleaseDataPrecision;

  private _artists: Artist[];

  constructor(name: string, type: AlbumType, tracks: Track[], releaseDate: string, releaseDatePrecision: ReleaseDataPrecision, artists: Artist[])
  {
    this._name = name;
    this._type = type;
    this._tracks = tracks;
    this._releaseDate = releaseDate;
    this._releaseDatePrecision = releaseDatePrecision;
    this._artists = artists;
  }

  public get id(): string
  {
    return this._id;
  }

  public get name(): string
  {
    return this._name;
  }

  public get type(): AlbumType
  {
    return this._type;
  }

  public get tracks(): Track[]
  {
    return this._tracks;
  }

  public get releaseDate(): string
  {
    return this._releaseDate;
  }

  public get releaseDatePrecision(): ReleaseDataPrecision
  {
    return this._releaseDatePrecision;
  }

  public get artists(): Artist[]
  {
    return this._artists;
  }
}
