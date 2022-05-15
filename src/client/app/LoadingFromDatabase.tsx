/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {UIRouterReact} from "@uirouter/react";
import {AppServices} from "app/client/app/AppServices";
import {DataStore} from "app/client/model/DataStore";
import {ITrack} from "app/client/model/Track";
import {TrackLoader} from "app/client/model/TrackLoader";
import {TrackLoaderController, TrackLoaderStatus} from "app/client/model/TrackLoaderController";
import React from "react";

export interface LoadingProps
{
  authToken: string | undefined;

  dataStore: DataStore;

  router: UIRouterReact;
}

export interface LoadingState
{
  status: "uninitialized" | "no_data" | "loading" | "loaded";
}

export class LoadingFromDatabase extends React.Component<LoadingProps, LoadingState>
{
  private _trackLoaderController: TrackLoaderController;

  constructor(props: Readonly<LoadingProps> | LoadingProps)
  {
    super(props);

    this._trackLoaderController = new TrackLoaderController(this.props.dataStore,
                                                            (status: TrackLoaderStatus) => {
                                                              this.setState({status: "loaded"});
                                                            });

    this.state = {status: "uninitialized"};
  }

  public override render(): React.ReactNode
  {
    switch (this.state.status)
    {
      case "uninitialized":
        return <div>"Figuring out what to do ..."</div>;

      case "no_data":
        return <TrackLoader authToken={this.props.authToken} controller={this._trackLoaderController}/>;

      case "loading":
        return <div>Loading track information ...</div>;

      case "loaded":
        return <div>Going to the browser...</div>;
    }
  }

  public override async componentDidMount(): Promise<void>
  {
    const numTracks = await AppServices.db.tracks?.count();

    if (numTracks === 0)
    {
      this.setState({status: "no_data"});
    }
    else
    {
      this.setState({status: "loading"});

      await AppServices.db.tracks.each((track: ITrack) => {
        this.props.dataStore.addTrack(track);
      });
      this.setState({status: "loaded"});
    }
  }

  public override componentDidUpdate(prevProps: Readonly<LoadingProps>, prevState: Readonly<LoadingState>, snapshot?: any)
  {
    if (this.state.status === "loaded")
    {
      this.props.router.stateService.go("browser");
    }
  }
}
