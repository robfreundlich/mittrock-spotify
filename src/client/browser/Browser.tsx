/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {UIRouterReact} from "@uirouter/react";
import {BrowserController} from "app/client/browser/BrowserController";
import {IAlbum} from "app/client/model/Album";
import {IArtist} from "app/client/model/Artist";
import {DataStore} from "app/client/model/DataStore";
import {IGenre} from "app/client/model/Genre";
import {IPlaylist} from "app/client/model/Playlist";
import {ITrack} from "app/client/model/Track";
import * as React from "react";
import {IdentifiedObject} from "app/client/model/IdentifiedObject";
import {BrowserBody} from "app/client/browser/BrowserBody";

export type BrowserProviderType = "dataStore"
  | "favorites"
  | "albums"
  | "album"
  | "artists"
  | "artist"
  | "genres"
  | "genre"
  | "playlists"
  | "playlist"
  | "tracks";

export interface BrowserProvider
{
  browserProviderType: BrowserProviderType;
  tracks: ITrack[];
  getFavorites: () => ITrack[];
  albums: IAlbum[];
  artists: IArtist[];
  genres: IGenre[];
  playlists: IPlaylist[];
  compareTracks?: (a: ITrack, b: ITrack) => number;
}

export interface BrowserObjectProvider
{
  getObject(): IdentifiedObject | IGenre | undefined;
}

interface BrowserProps
{
  dataStore: DataStore;
  router: UIRouterReact;
  providers: BrowserProvider[];
  path: string;
}

export class Browser extends React.Component<BrowserProps>
{
  private readonly controller: BrowserController;

  constructor(props: Readonly<BrowserProps> | BrowserProps)
  {
    super(props);
    this.controller = new BrowserController(props.dataStore, this.props.router);
  }
  
  private get provider(): BrowserProvider
  {
    return this.props.providers[this.props.providers.length - 1];
  }

  public override render()
  {
    if (!this.provider.tracks)
    {
      return null;
    }

    return <>
      <div className="header">
        {this.renderHeader()}
      </div>
      <div className="body">
        {this.renderBody()}
      </div>
      <div className="footer">Footer</div>
    </>;
  }

  private renderHeader(): React.ReactNode
  {
    const arrow: string = "\u2192";

    const onHomeClicked = () => {
      this.controller.goHome();
    }

    const gotoSubPath = (subPath: string) => () => {
      this.controller.goTo(subPath);
    }

    return <>
      <div className={"path"}>
        <span className={"home"} onClick={onHomeClicked}>&#127968;</span>
        {(this.props.path !== "") && this.props.path.split(BrowserController.PATH_SEP)
          .map((pathPart, index, parts) => {
            return <span>{arrow}
              <span className={"path-part"}
                    onClick={gotoSubPath(parts.slice(0, index + 1).join(BrowserController.PATH_SEP))}>
                {this.renderPathPart(pathPart, index + 1)}
              </span>
          </span>;
          })}
      </div>
      <div className="track-count">
        {this.provider.tracks.length} Tracks
      </div>
    </>;
  }

  private renderPathPart(pathPart: string, index: number): React.ReactNode
  {
    if (pathPart.indexOf(BrowserController.PART_SEP) !== -1)
    {
      const object: IdentifiedObject | IGenre | undefined = (this.props.providers[index] as unknown as BrowserObjectProvider).getObject();

      if (object)
      {
        return object.name
      }
    }

    return pathPart;
  }

  private renderBody(): React.ReactNode
  {
    return <BrowserBody controller={this.controller}
                        path={this.props.path}
                        provider={this.provider}/>;
  }

  public override componentDidMount(): void
  {
    this.controller.checkForData();
  }

}
