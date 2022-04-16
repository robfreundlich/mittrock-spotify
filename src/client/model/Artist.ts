/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {Genre} from "client/model/Genre";

export class Artist
{
  private _name: string;

  private _genres: Genre[];

  private _popularity: number; // 0 to 100

  constructor(name: string, popularity: number, genres: Genre[])
  {
    this._name = name;
    this._genres = genres;
    this._popularity = popularity;
  }

  public get name(): string
  {
    return this._name;
  }

  public get genres(): Genre[]
  {
    return this._genres;
  }

  public get popularity(): number
  {
    return this._popularity;
  }
}
