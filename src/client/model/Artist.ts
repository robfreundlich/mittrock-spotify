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
  private _id: string;

  private _name: string;

  private _genres: IGenre[];

  private _popularity: number; // 0 to 100

  constructor(id: string, name: string, popularity: number, genres: IGenre[])
  {
    this._id = id;
    this._name = name;
    this._genres = genres;
    this._popularity = popularity;
  }

  public get id(): string
  {
    return this._id;
  }

  public get name(): string
  {
    return this._name;
  }

  public get genres(): IGenre[]
  {
    return this._genres;
  }

  public get popularity(): number
  {
    return this._popularity;
  }
}
