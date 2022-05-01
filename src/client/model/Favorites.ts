/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {ITrackSource, TrackSource} from "app/client/model/TrackSource";

export interface IFavorites extends ITrackSource
{

}

export class Favorites implements IFavorites
{
  private static readonly guardValue: Object = new Object();

  public static readonly favorites: Favorites = new Favorites(Favorites.guardValue);

  public readonly sourceType: TrackSource = "favorite";

  // @ts-ignore: unused variable
  private _guard: object;

  constructor(guard: object)
  {
    this._guard = guard;
  }
}
