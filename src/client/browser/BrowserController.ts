/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {DataStore} from "app/client/model/DataStore";

export class BrowserController
{
  private _dataStore: DataStore;

  constructor(dataStore: DataStore)
  {
    this._dataStore = dataStore;
  }

  public get dataStore(): DataStore
  {
    return this._dataStore;
  }

}
