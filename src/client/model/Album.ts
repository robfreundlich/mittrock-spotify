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

  public readonly id: string;

  public readonly name: string;

  public readonly type: AlbumType;

  public readonly tracks: ITrack[];

  public readonly releaseDate: string;  // Format: "YYYY", "YYYY-MM", "YYYY-MM-DD"

  public readonly releaseDatePrecision: ReleaseDatePrecision;

  public readonly artists: IArtist[];

  constructor(id: string, name: string, type: AlbumType, releaseDate: string, releaseDatePrecision: ReleaseDatePrecision, artists: IArtist[], tracks?: ITrack[])
  {
    this.id = id;
    this.name = name;
    this.type = type;
    this.releaseDate = releaseDate;
    this.releaseDatePrecision = releaseDatePrecision;
    this.artists = artists;

    if (tracks)
    {
      this.tracks = tracks;
    }
    else
    {
      this.tracks = [];
    }
  }

  public addTrack(track: ITrack): void
  {
    ArrayUtils.pushIfMissing(this.tracks, track, areIdentifiedObjectsSame);
  }

}
