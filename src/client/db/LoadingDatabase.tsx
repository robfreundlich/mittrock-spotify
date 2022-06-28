/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {UIRouterReact} from "@uirouter/react";
import {TrackLoader} from "app/client/db/TrackLoader";
import {TrackLoaderController, TrackLoaderStatus} from "app/client/db/TrackLoaderController";
import {DataStore} from "app/client/model/DataStore";
import {router} from "app/router.config";
import React from "react";

export interface LoadingDatabaseProps
{
  authToken: string | undefined;

  dataStore: DataStore;

  router: UIRouterReact;
}

export class LoadingDatabase extends React.Component<LoadingDatabaseProps, TrackLoaderStatus>
{
  private _trackLoaderController: TrackLoaderController;

  constructor(props: LoadingDatabaseProps)
  {
    super(props);
    this._trackLoaderController = new TrackLoaderController(this.props.dataStore, router, (status: TrackLoaderStatus) => {
      this.setState(status);
    });
  }

  private renderHeader(): React.ReactNode
  {
    return <>
      <button disabled={this.state && this.state.status !== "unloaded"}
              onClick={() => this._trackLoaderController.startLoading()}>Load
      </button>

      <button disabled={!TrackLoaderController.isRunning(this.state?.status)}
              onClick={() => this._trackLoaderController.stop()}>Stop
      </button>

      <button disabled={!TrackLoaderController.isBrowsable(this.state?.status)}
              onClick={() => this._trackLoaderController.gotoBrowser()}>Browse
      </button>
    </>;
  }

  private renderBody(): React.ReactNode
  {
    return <TrackLoader authToken={this.props.authToken}
                        controller={this._trackLoaderController}
                        status={this.state}
    />;
  }

  private renderFooter(): React.ReactNode
  {
    return <div>{this._trackLoaderController.status?.status} {this._trackLoaderController.status?.subStatus}</div>;
  }

  public override render(): React.ReactNode
  {
    return <>
      <div className="header">
        {this.renderHeader()}
      </div>
      <div className="body">
        {this.renderBody()}
      </div>
      <div className="footer">
        {this.renderFooter()}
      </div>
    </>;
  }
}

