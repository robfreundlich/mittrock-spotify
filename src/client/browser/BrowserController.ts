/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {UIRouterReact} from "@uirouter/react";
import {compareByName} from "app/client/model/ComparisonFunctions";
import {DataStore} from "app/client/model/DataStore";

export class BrowserController
{
  private static readonly PREVIEW_COUNT = 8;

  private _dataStore: DataStore;

  private _router: UIRouterReact;

  constructor(dataStore: DataStore, router: UIRouterReact)
  {
    this._dataStore = dataStore;
    this._router = router;
  }

  public get dataStore(): DataStore
  {
    return this._dataStore;
  }

  public checkForData(): void
  {
    if (!this.dataStore.tracks?.length)
    {
      this._router.stateService.go("loading");
    }
  }

  public getFirstN<T extends { name: string }>(array: T[], n?: number): T[]
  {
    n = n ?? BrowserController.PREVIEW_COUNT;
    return array.slice()
                .sort(compareByName)
                .slice(0, Math.min(array.length, n));
  }

  public hasMore<T>(array: T[]): boolean
  {
    return array.length > BrowserController.PREVIEW_COUNT;
  }
}
