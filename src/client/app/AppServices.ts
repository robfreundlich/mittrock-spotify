/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {DexieDB} from "app/client/db/DexieDB";
import {DataStore} from "app/client/model/DataStore";

export class AppServices
{
  private static _dataStore: DataStore;

  public static get dataStore(): DataStore
  {
    return this._dataStore;
  }

  public static get db(): DexieDB
  {
    return DexieDB.db;
  }

  public static initialize(): void
  {
    this._dataStore = new DataStore();
  }
}
