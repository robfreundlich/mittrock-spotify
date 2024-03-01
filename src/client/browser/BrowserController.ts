/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {UIRouterReact} from "@uirouter/react";
import {DataStore} from "app/client/model/DataStore";
import {browserState} from "app/client/app/states";

export class BrowserController
{
  public static readonly PREVIEW_COUNT = 8;

  public static readonly PATH_SEP: string = "\u241C";
  public static readonly PART_SEP: string = "\u241D";

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

  public getFirstN<T>(array: T[],
                      compare: (a: T, B: T) => number,
                      n?: number): T[]
  {
    n = n ?? BrowserController.PREVIEW_COUNT;
    return array.slice()
                .sort(compare)
                .slice(0, Math.min(array.length, n));
  }

  public hasMore<T>(array: T[]): boolean
  {
    return array.length > BrowserController.PREVIEW_COUNT;
  }

  public goHome(): void
  {
    this._router.stateService.go(browserState.name, {path: ""}, {location: true, reload: true});
  }

  public gotoObject(path: string, type: string, id: string)
  {
    const pathParts: string[] = path === "" ? [] : path.split(BrowserController.PATH_SEP);
    pathParts.push(type + BrowserController.PART_SEP + id);

    const newPath: string = pathParts.join(BrowserController.PATH_SEP);

    this._router.stateService.go(browserState.name, {path: newPath}, {location: true, reload: true});
  }

  public goTo(path: string, child?: string): void
  {
    const pathParts: string[] = path === "" ? [] : path.split(BrowserController.PATH_SEP);
    if (child)
    {
      pathParts.push(child);
    }

    const newPath: string = pathParts.join(BrowserController.PATH_SEP);

    this._router.stateService.go(browserState.name, {path: newPath}, {location: true, reload: true});
  }
}
