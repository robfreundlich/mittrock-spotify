/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {UIRouterReact} from "@uirouter/react";
import {AppServices} from "app/client/app/AppServices";
import {browserState, loadingDatabaseState} from "app/client/app/states";
import {DataStore} from "app/client/model/DataStore";
import React from "react";
import {DBTrack} from "app/client/db/DBTrack";
import {Track} from "app/client/model/Track";
import {ModelUtils} from "app/client/utils/ModelUtils";
import {Transaction} from "dexie";

export interface LoadingFromDatabaseProps
{
  authToken: string | undefined;

  dataStore: DataStore;

  router: UIRouterReact;
}

export interface LoadingState
{
  status: "uninitialized" | "no_data" | "loading" | "loaded";
  track?: Track;
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
        return <div>Loading track information {this.state.track?.name ?? ""} ...</div>;

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
    else if (this.state.status !== "loading")
    {
      this.setState({status: "loading"});

      const trackPromises: Promise<void>[] = [];

      const makeTrack = async (dbTrack: DBTrack): Promise<void> => {
        const track: Track = await ModelUtils.makeTrack(AppServices.db, this.props.dataStore, dbTrack);
        this.setState( {status: "loading", track: track });
        this.props.dataStore.addTrack(track)
        return Promise.resolve();
      };

      await AppServices.db.transaction("r",
        "tracks", "artists", "albums", "playlists",
        async (trans: Transaction) => {


          // let i: number = 0;
          AppServices.db.tracks.each(async (track: DBTrack) => {
            // if (i > 100)
            // {
            //   return;
            // }
            trackPromises.push(makeTrack(track));

            // i++;
          })
            .then(() => {
              Promise.all([...trackPromises])
                .then(() => {
                  this.setState({status: "loaded"});
                });
            });
        });
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
