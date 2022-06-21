/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {UIRouterReact} from "@uirouter/react";
import {AppServices} from "app/client/app/AppServices";
import {browserState, loadingDatabaseState} from "app/client/app/states";
import {DBTrack} from "app/client/db/DBTrack";
import {DataStore} from "app/client/model/DataStore";
import React from "react";

export interface LoadingFromDatabaseProps
{
  authToken: string | undefined;

  dataStore: DataStore;

  router: UIRouterReact;
}

export interface LoadingState
{
  status: "uninitialized" | "no_data" | "loading" | "loaded";
}

export class LoadingFromDatabase extends React.Component<LoadingFromDatabaseProps, LoadingState>
{
  constructor(props: Readonly<LoadingFromDatabaseProps> | LoadingFromDatabaseProps)
  {
    super(props);

    this.state = {status: "uninitialized"};
  }

  public override render(): React.ReactNode
  {
    switch (this.state.status)
    {
      case "uninitialized":
        return <div>"Figuring out what to do ..."</div>;

      case "no_data":
        return <div>Going to data loader page ...</div>;

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

      await AppServices.db.tracks.each((track: DBTrack) => {
        // this.props.dataStore.addTrack(track);
      });
      this.setState({status: "loaded"});
    }
  }

  public override componentDidUpdate(prevProps: Readonly<LoadingFromDatabaseProps>, prevState: Readonly<LoadingState>, snapshot?: any)
  {
    if (this.state.status === "no_data")
    {
      this.props.router.stateService.go(loadingDatabaseState.name,
                                        {},
                                        {
                                          location: true,
                                          inherit: true
                                        });
    }
    else if (this.state.status === "loaded")
    {
      this.props.router.stateService.go(browserState.name,
                                        {},
                                        {
                                          location: true,
                                          inherit: true
                                        });
    }
  }
}
