/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IGenre} from "app/client/model/Genre";
import {IdentifiedObject} from "app/client/model/IdentifiedObject";

export interface IArtist extends IdentifiedObject
{
  id: string;

  name: string;

  genres: IGenre[];

  popularity: number;
}

export class Artist implements IArtist
{
  public readonly id: string;

  public readonly name: string;

  public readonly genres: IGenre[];

  public readonly popularity: number; // 0 to 100

  constructor(id: string, name: string, popularity: number, genres: IGenre[])
  {
    this.id = id;
    this.name = name;
    this.genres = genres;
    this.popularity = popularity;
  }
}
