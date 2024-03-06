/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IArtist} from "app/client/model/Artist";
import {areIdentifiedObjectsSame, IdentifiedObject} from "app/client/model/IdentifiedObject";
import {ITrack} from "app/client/model/Track";
import {ITrackSource, TrackSourceType} from "app/client/model/TrackSource";
import {ArrayUtils} from "app/client/utils/ArrayUtils";
import {AlbumType, ReleaseDatePrecision} from "app/client/utils/Types";
import {SpotifyImage} from "spotify-web-api-ts/types/types/SpotifyObjects";

export interface IAlbum extends IdentifiedObject, ITrackSource
{
  id: string;

  name: string;

  albumType: AlbumType;

  tracks: ITrack[];

  releaseDate: string;  // Format: "YYYY", "YYYY-MM", "YYYY-MM-DD"

  releaseDatePrecision: ReleaseDatePrecision;

  artists: IArtist[];

  addedAt: Date | undefined;

  images: SpotifyImage[];
}

export class Album implements IAlbum
{
  public readonly sourceType: TrackSourceType = "album";

  public readonly id: string;

  public readonly type: string = "album";

  public readonly name: string;

  public readonly albumType: AlbumType;

  public readonly tracks: ITrack[];

  public readonly releaseDate: string;  // Format: "YYYY", "YYYY-MM", "YYYY-MM-DD"

  public readonly releaseDatePrecision: ReleaseDatePrecision;

  public readonly artists: IArtist[];

  public readonly addedAt: Date | undefined;

  public readonly images: SpotifyImage[];

  constructor(id: string,
              name: string,
              type: AlbumType,
              releaseDate: string,
              releaseDatePrecision: ReleaseDatePrecision,
              artists: IArtist[],
              images: SpotifyImage[],
              addedAt?: Date,
              tracks?: ITrack[])
  {
    this.id = id;
    this.name = name;
    this.albumType = type;
    this.releaseDate = releaseDate;
    this.releaseDatePrecision = releaseDatePrecision;
    this.artists = artists;
    this.images = images;
    this.addedAt = addedAt;

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
