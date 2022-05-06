/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IArtist} from "app/client/model/Artist";
import {areIdentifiedObjectsSame, IdentifiedObject} from "app/client/model/IdentifiedObject";
import {ITrack} from "app/client/model/Track";
import {ITrackSource, TrackSource} from "app/client/model/TrackSource";
import {ArrayUtils} from "app/client/utils/ArrayUtils";
import {AlbumType, ReleaseDatePrecision} from "app/client/utils/Types";

export interface IAlbum extends IdentifiedObject, ITrackSource
{
  id: string;

  name: string;

  type: AlbumType;

  tracks: ITrack[];

  releaseDate: string;  // Format: "YYYY", "YYYY-MM", "YYYY-MM-DD"

  releaseDatePrecision: ReleaseDatePrecision;

  artists: IArtist[];
}

export class Album implements IAlbum
{
  public readonly sourceType: TrackSource = "album";

  private _id: string;

  private _name: string;

  private _type: AlbumType;

  private _tracks: ITrack[];

  private _releaseDate: string;  // Format: "YYYY", "YYYY-MM", "YYYY-MM-DD"

  private _releaseDatePrecision: ReleaseDatePrecision;

  private _artists: IArtist[];

  constructor(id: string, name: string, type: AlbumType, releaseDate: string, releaseDatePrecision: ReleaseDatePrecision, artists: IArtist[], tracks?: ITrack[])
  {
    this._id = id;
    this._name = name;
    this._type = type;
    this._releaseDate = releaseDate;
    this._releaseDatePrecision = releaseDatePrecision;
    this._artists = artists;

    if (tracks)
    {
      this._tracks = tracks;
    }
    else
    {
      this._tracks = [];
    }
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

  public get tracks(): ITrack[]
  {
    return this._tracks;
  }

  public get releaseDate(): string
  {
    return this._releaseDate;
  }

  public get releaseDatePrecision(): ReleaseDatePrecision
  {
    return this._releaseDatePrecision;
  }

  public get artists(): IArtist[]
  {
    return this._artists;
  }

  public addTrack(track: ITrack): void
  {
    ArrayUtils.pushIfMissing(this._tracks, track, areIdentifiedObjectsSame);
  }

}
