/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {UIRouterReact} from "@uirouter/react";
import {BrowserController} from "app/client/browser/BrowserController";
import {IAlbum} from "app/client/model/Album";
import {IArtist} from "app/client/model/Artist";
import {compareByAddedAtDesc, compareByName} from "app/client/model/ComparisonFunctions";
import {DataStore} from "app/client/model/DataStore";
import {IGenre} from "app/client/model/Genre";
import {IPlaylist} from "app/client/model/Playlist";
import {ITrack} from "app/client/model/Track";
import * as React from "react";
import BrowserSection, {GenresSection} from "app/client/browser/BrowserSection";

export interface BrowserProvider
{
  tracks: ITrack[];
  getFavorites: () => ITrack[];
  albums: IAlbum[];
  artists: IArtist[];
  genres: IGenre[];
  playlists: IPlaylist[];
}

interface BrowserProps
{
  dataStore: DataStore;
  router: UIRouterReact;
  provider: BrowserProvider;
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

  public override render()
  {
    if (!this.props.provider.tracks)
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
                {pathPart}
              </span>
          </span>;
          })}
      </div>
      <div className="track-count">
        {this.props.provider.tracks.length} Tracks
      </div>
    </>;
  }

  private renderBody(): React.ReactNode
  {
    return <div className="browser">
      {this.renderFavorites()}
      {this.renderAlbums()}
      {this.renderArtists()}
      {this.renderGenres()}
      {this.renderPlaylists()}
      {this.renderTracks()}
    </div>;
  }

  private renderFavorites(): React.ReactNode
  {
    return <BrowserSection className={"favorites"}
                           headerText={"Favorites"}
                           controller={this.controller}
                           objects={this.props.provider.getFavorites()}
                           compare={compareByAddedAtDesc}
                           render={(track: ITrack) => {
                             return <div className="track item" key={track.id}>
                               <div className="track-name">{track.name}</div>
                               <div className="album-name">{track.album?.name}</div>
                               <GenresSection genres={track.genres} controller={this.controller}/>
                             </div>;
                           }}/>;
  }

  private renderAlbums(): React.ReactNode
  {
    return <BrowserSection className={"albums"}
                           headerText={"Albums"}
                           controller={this.controller}
                           objects={this.props.provider.albums}
                           compare={compareByAddedAtDesc}
                           render={(album: IAlbum) => {
                             const genres: Set<IGenre> = new Set();
                             album.tracks.forEach((track: ITrack) => track.genres
                               .forEach((genre: IGenre) => genres.add(genre)));

                             return <div className="album item" key={album.id}>
                               <div className="album-name">{album.name}</div>
                               <GenresSection genres={[ ...genres ]} controller={this.controller}/>
                             </div>;
                           }}/>;
  }

  private renderArtists(): React.ReactNode
  {
    return <BrowserSection className={"artists"}
                           headerText={"Artists"}
                           controller={this.controller}
                           objects={this.props.provider.artists.filter((artist: IArtist) => artist.name !== "")}
                           compare={compareByName}
                           render={(artist: IArtist) => {
                             return <div className="artist item" key={artist.id}>
                               <div className="artist-name">{artist.name}</div>
                               <GenresSection genres={artist.genres}
                                              controller={this.controller}/>
                             </div>;
                           }}/>
  }

  private renderGenres(): React.ReactNode
  {
    return <BrowserSection className={"genres"}
                           headerText={"Genres"}
                           controller={this.controller}
                           objects={this.props.provider.genres}
                           compare={compareByName}
                           render={(genre: IGenre) => {
                             return <div className="genre item">
                               <div className="name">{genre.name}</div>
                             </div>;
                           }}/>;
  }

  private renderPlaylists(): React.ReactNode
  {
    return <BrowserSection className={"playlists"}
                           headerText={"Playlists"}
                           controller={this.controller}
                           objects={this.props.provider.playlists}
                           compare={compareByName}
                           render={(playlist: IPlaylist) => {
                             const genres: Set<IGenre> = new Set();
                             playlist.tracks.forEach((track: ITrack) => track.genres.forEach((genre: IGenre) => genres.add(genre)));
                             return <div className="playlist item" key={playlist.id}>
                               <div className="playlist-name">{playlist.name}</div>
                               <GenresSection genres={[... genres]}
                                              controller={this.controller}/>
                             </div>;
                           }}/>;
  }

  private renderTracks(): React.ReactNode
  {
    return <BrowserSection className={"tracks"}
                           headerText={"Tracks"}
                           controller={this.controller}
                           objects={this.props.provider.tracks}
                           compare={compareByName}
                           render={(track: ITrack) => {
                             return <div className="track item" key={track.id}>
                               <div className="track-name">{track.name}</div>
                               <div className="album-name">{track.album?.name}</div>
                               <GenresSection genres={track.genres}
                                              controller={this.controller}/>
                             </div>;
                           }}/>;
  }

  public override componentDidMount(): void
  {
    this.controller.checkForData();
  }

}
