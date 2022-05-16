/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {UIRouterReact} from "@uirouter/react";
import {DataStore} from "app/client/model/DataStore";
import {TrackLoader} from "app/client/model/TrackLoader";
import {TrackLoaderController, TrackLoaderStatus} from "app/client/model/TrackLoaderController";
import React from "react";

export interface LoadingDatabaseProps
{
  authToken: string | undefined;

  dataStore: DataStore;

  router: UIRouterReact;
}

export type LoadingDatabaseStatus = "unloaded"
    | "clearing_data"
    | "loading_favorites"
    | "loading_albums"
    | "loading_playlists"
    | "loading_playlist_tracks"
    | "loaded"
    | "saving_to_database"
    | "error"
    | "stopped";

export class LoadingDatabase extends React.Component<LoadingDatabaseProps, { status: LoadingDatabaseStatus }>
{
  private _trackLoaderController: TrackLoaderController;

  constructor(props: LoadingDatabaseProps)
  {
    super(props);
    this._trackLoaderController = new TrackLoaderController(this.props.dataStore,
                                                            (status: TrackLoaderStatus) => {
                                                              this.setState({status: status.status});
                                                            });
  }

  public override render(): React.ReactNode
  {
    return <TrackLoader authToken={this.props.authToken} controller={this._trackLoaderController}/>;
  }

  public override componentDidMount(): void
  {
    // if (["unloaded", "clearing_data", "error", "stopped"].indexOf(this._trackLoaderController.status.status) === -1)
    // {
    //   this._trackLoaderController.startLoading();
    // }
  }
}

