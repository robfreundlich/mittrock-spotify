/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {TrackLoaderController, TrackLoaderStatus} from "app/client/model/TrackLoaderController";
import {TimeUtils} from "app/client/utils/TimeUtils";
import React from "react";

export interface TrackLoaderProps
{
  authToken: string | undefined;

  controller: TrackLoaderController;
}

export class TrackLoader extends React.Component<TrackLoaderProps, TrackLoaderStatus>
{
  constructor(props: Readonly<TrackLoaderProps>)
  {
    super(props);

    this.state = {status: "unloaded", currentTime: new Date()};
    this.props.controller.onStatusChanged = (status) => {
      this.setState(status);
    };
    this.props.controller.setStatus({status: "unloaded"});
  }

  public override render()
  {
    if (this.state.status === "unloaded")
    {
      return <button disabled={this.state.status !== "unloaded"}
                     onClick={() => this.props.controller.startLoading()}>Click to begin loading</button>;
    }

    return <div className="track-loader">

      <div className="status-bar">
        <button onClick={() => this.state = {status: "stopped", currentTime: new Date()}}>Stop</button>
        <div>{this.props.controller.status.status}</div>
      </div>

      <div className="progress">

        {(this.state.status === "error") && <div className="error-container container">
          <div className="error-label label">Error</div>
          <textarea className="error-content data" value={this.state.error}/>
        </div>}

        <div className="favorites-container container item">
          <div className="label">Favorites</div>
          <div className="data">{this.props.controller.dataStore.numFavoriteTracks}</div>
        </div>

        <div className="albums-container container">
          <div className="albums item">
            <div className="label">Albums</div>
            <div className="data">{this.props.controller.dataStore.albums.length}</div>
          </div>
          <div className="tracks item">
            <div className="label">Tracks</div>
            <div className="data">{this.props.controller.dataStore.numAlbumTracks}</div>
          </div>
        </div>

        <div className="playlists-container container">
          <div className="playlists item">
            <div className="label">Playlists</div>
            <div className="data">{this.props.controller.dataStore.playlists.length}</div>
          </div>
          <div className="tracks item">
            <div className="label">Tracks</div>
            <div className="data">{this.props.controller.dataStore.numPlaylistTracks}</div>
          </div>
        </div>

        <div className="totals-container container">
          <div className="total-tracks item">
            <div className="label">Total tracks</div>
            <div className="data">{this.props.controller.dataStore.tracks.length}</div>
          </div>
          <div className="elapsed-time item">
            <div className="label">Elapsed time</div>
            <div className="data">{TimeUtils.getElapsedTime(this.props.controller.startTime, this.state.currentTime)}</div>
          </div>
        </div>
      </div>
    </div>;
  }

  public override componentDidMount(): void
  {
    this.updateFromStateAndProps();
  }

  public override componentDidUpdate(prevProps: Readonly<TrackLoaderProps>, prevState: Readonly<TrackLoaderStatus>): void
  {
    this.updateFromStateAndProps(prevProps, prevState);
  }

  private updateFromStateAndProps(prevProps?: Readonly<TrackLoaderProps>, prevState?: Readonly<TrackLoaderStatus>): void
  {
    const currentAuthToken: string | undefined = this.props.authToken;
    const previousAuthToken: string | undefined = prevProps?.authToken;

    this.props.controller.onAuthTokenChanged(currentAuthToken, previousAuthToken);
    this.props.controller.handlePossibleStateChange(prevState);
  }

}

