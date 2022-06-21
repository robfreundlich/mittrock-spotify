/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {TrackLoaderController, TrackLoaderStatus} from "app/client/db/TrackLoaderController";
import {TimeUtils} from "app/client/utils/TimeUtils";
import React from "react";

export interface TrackLoaderProps
{
  authToken: string | undefined;

  controller: TrackLoaderController;

  status: TrackLoaderStatus;
}

export class TrackLoader extends React.Component<TrackLoaderProps>
{
  constructor(props: Readonly<TrackLoaderProps>)
  {
    super(props);
  }

  public override render()
  {
    return <div className="track-loader">
      <div className="progress">
        {(this.props.status?.status === "error") && <div className="error-container container">
          <div className="error-label label">Error</div>
          <textarea className="error-content data" value={this.props.status?.error}/>
        </div>}

        {/*<div className="favorites-container container item">*/}
        {/*  <div className="label">Favorites</div>*/}
        {/*  <div className="data">{this.props.controller.tracks.length}</div>*/}
        {/*</div>*/}

        <div className="albums-container container">
          <div className="albums item">
            <div className="label">Albums</div>
            <div className="data">{this.props.controller.albums.length}</div>
          </div>
          {/*<div className="tracks item">*/}
          {/*  <div className="label">Tracks</div>*/}
          {/*  <div className="data">{this.props.controller.dataStore.numAlbumTracks}</div>*/}
          {/*</div>*/}
        </div>

        {/*<div className="playlists-container container">*/}
        {/*  <div className="playlists item">*/}
        {/*    <div className="label">Playlists</div>*/}
        {/*    <div className="data">{this.props.controller.dataStore.playlists.length}</div>*/}
        {/*  </div>*/}
        {/*  <div className="tracks item">*/}
        {/*    <div className="label">Tracks</div>*/}
        {/*    <div className="data">{this.props.controller.dataStore.numPlaylistTracks}</div>*/}
        {/*  </div>*/}
        {/*</div>*/}

        <div className="totals-container container">
          <div className="total-tracks item">
            <div className="label">Total tracks</div>
            <div className="data">{this.props.controller.tracks.length}</div>
          </div>
          <div className="elapsed-time item">
            <div className="label">Elapsed time</div>
            <div className="data">{TimeUtils.getElapsedTime(this.props.controller.startTime, this.props.status?.currentTime)}</div>
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
