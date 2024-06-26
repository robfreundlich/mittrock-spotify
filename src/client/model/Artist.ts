/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IGenre} from "app/client/model/Genre";
import {IdentifiedObject} from "app/client/model/IdentifiedObject";
import {IncludedObject} from "app/client/model/IncludedObject";
import {InclusionReason} from "app/client/utils/Types";
import {SpotifyImage} from "spotify-web-api-ts/types/types/SpotifyObjects";

export interface IArtist extends IdentifiedObject, IncludedObject
{
  id: string;

  name: string;

  genres: IGenre[];

  popularity: number;

  images: SpotifyImage[];

  inclusionReasons: InclusionReason[];
}

export class Artist implements IArtist
{
  public readonly id: string;

  public readonly type: string = "artist";

  public readonly name: string;

  public readonly genres: IGenre[];

  public readonly popularity: number; // 0 to 100

  public readonly images: SpotifyImage[];


  private _inclusionReasons: InclusionReason[] = [];

  constructor(id: string, name: string, popularity: number, genres: IGenre[], images: SpotifyImage[])
  {
    this.id = id;
    this.name = name;
    this.genres = genres;
    this.images = images;
    this.popularity = popularity;
  }

  public get inclusionReasons(): InclusionReason[]
  {
    return this._inclusionReasons.slice();
  }

  public addIncludedReason(reason: InclusionReason): void
  {
    this._inclusionReasons.push(reason);
  }
}
