/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {AppServices} from "app/client/app/AppServices";
import {DataStore} from "app/client/model/DataStore";
import {ITrack} from "app/client/model/Track";
import {TrackLoaderController, TrackLoaderStatus} from "app/client/model/TrackLoaderController";
import {getCookie} from "typescript-cookie";

export type AppState = "authorizing" | "authorized" | "no_data" | "loading" | "loaded";

export class AppController
{
  private _state: AppState;

  private _onStateChanged: (state: AppState) => void;

  private _dataStore: DataStore;

  private _cookie: string | undefined;

  private _token: string | undefined;

  private _trackLoaderController: TrackLoaderController;

  constructor(onStateChanged: (state: AppState) => void)
  {
    AppServices.initialize();
    this._onStateChanged = onStateChanged;

    this.setState("authorizing");

    this._cookie = getCookie("spotifyAuthToken");

    this._dataStore = new DataStore();
    this.setToken(this._cookie);
  }

  public get state(): AppState
  {
    return this._state;
  }

  public get trackLoaderController(): TrackLoaderController
  {
    return this._trackLoaderController;
  }

  public get cookie(): string | undefined
  {
    return this._cookie;
  }

  public get token(): string | undefined
  {
    return this._token;
  }

  public get dataStore(): DataStore
  {
    return this._dataStore;
  }

  public async setToken(value: string | undefined): Promise<void>
  {
    this._token = value;
    if (this._token)
    {
      this.setState("authorized");
    }

    this._trackLoaderController = new TrackLoaderController(this._dataStore,
                                                            (status: TrackLoaderStatus) => {
                                                              this.setState("loaded");
                                                            });

    const numTracks = await AppServices.db.tracks?.count();

    if (numTracks === 0)
    {
      this.setState("no_data");
    }
    else
    {
      this.setState("loading");

      await AppServices.db.tracks.each((track: ITrack) => {
        this.dataStore.addTrack(track);
      });
      this.setState("loaded");
    }
  }

  private setState(state: AppState): void
  {
    this._state = state;
    this._onStateChanged(this.state);
  }

}
