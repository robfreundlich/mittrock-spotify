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
import Accordion from "app/client/controls/Accordion";

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
  private controller: BrowserController;

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
    const favorites: ITrack[] = this.props.provider.getFavorites();

    if (favorites.length === 0)
    {
      return null;
    }

    const isAll: boolean = (this.props.path !== "") && (this.props.path.split(BrowserController.PATH_SEP).reverse()[0] === "favorites");

    const onMoreClicked = () => {
      this.controller.goTo(this.props.path, "favorites");
    };

    return <Accordion className="favorites"
                      header={`Favorites (${favorites.length})`}
                      open={isAll}>
      <div className="tracks item-container">
        {this.controller.getFirstN(favorites, compareByAddedAtDesc, isAll ? favorites.length : BrowserController.PREVIEW_COUNT)
          .map((track: ITrack) => <div className="track item" key={track.id}>
            <div className="track-name">{track.name}</div>
            <div className="album-name">{track.album?.name}</div>
            <div className="genres">
              {this.controller.getFirstN(track.genres, compareByName, 3)
                .map((genre: IGenre, index: number) => <div className="genre" key={`${index}`}>{genre.name}</div>)}
              {(track.genres.length > 3) && <div className="genre more">...</div>}
            </div>
          </div>)}

        {!isAll && this.controller.hasMore(favorites) && <div className="more" key="more" onClick={onMoreClicked}>More...</div>}
      </div>
    </Accordion>;
  }

  private renderAlbums(): React.ReactNode
  {
    const albums: IAlbum[] = this.props.provider.albums;

    if (albums.length === 0)
    {
      return null;
    }

    const isAll: boolean = (this.props.path !== "") && (this.props.path.split(BrowserController.PATH_SEP).reverse()[0] === "albums");

    const onMoreClicked = () => {
      this.controller.goTo(this.props.path, "albums");
    };

    return <Accordion className="albums"
                      header={`Albums (${albums.length})`}
                      open={isAll}>
      <div className="item-container">
        {this.controller.getFirstN(albums, compareByAddedAtDesc, isAll ? albums.length : BrowserController.PREVIEW_COUNT).map((album: IAlbum) => {
          const genres: Set<IGenre> = new Set();
          album.tracks.forEach((track: ITrack) => track.genres.forEach((genre: IGenre) => genres.add(genre)));

          return <div className="album item" key={album.id}>
            <div className="album-name">{album.name}</div>
            <div className="genres">
              {this.controller.getFirstN([...genres], compareByName, 3)
                   .map((genre: IGenre, index: number) => <div className="genre" key={`${index}`}>{genre.name}</div>)}
              {(genres.size > 3) && <div className="genre more">...</div>}
            </div>
          </div>;
        })}

        {!isAll && this.controller.hasMore(albums) && <div className="more" key="more" onClick={onMoreClicked}>More...</div>}
      </div>
    </Accordion>;
  }

  private renderArtists(): React.ReactNode
  {
    const artists: IArtist[] = this.props.provider.artists.filter((artist: IArtist) => artist.name !== "");

    if (artists.length === 0)
    {
      return null;
    }

    const isAll: boolean = (this.props.path !== "") && (this.props.path.split(BrowserController.PATH_SEP).reverse()[0] === "artists");

    const onMoreClicked = () => {
      this.controller.goTo(this.props.path, "artists");
    };

    return <Accordion className="artists"
                      header={`Artists (${artists.length})`}
                      open={isAll}>
      <div className="item-container">
        {this.controller.getFirstN(artists,
                                   compareByName,
                                   isAll ? artists.length : BrowserController.PREVIEW_COUNT)
          .map((artist: IArtist) =>
                 <div className="artist item" key={artist.id}>
                   <div className="artist-name">{artist.name}</div>
                   <div className="genres">
                     {this.controller.getFirstN(artist.genres, compareByName, 3)
                       .map((genre: IGenre, index: number) => <div className="genre"
                                                                   key={index}>{genre.name}</div>)}
                     {(artist.genres.length > 3) && <div className="genre more">...</div>}
                   </div>
                 </div>)}

        {!isAll && this.controller.hasMore(artists)
          && <div className="more"
                  key="more"
                  onClick={onMoreClicked}
            >More...</div>}
      </div>
    </Accordion>;
  }

  private renderGenres(): React.ReactNode
  {
    const genres: IGenre[] = this.props.provider.genres;

    if (genres.length === 0)
    {
      return null;
    }

    const isAll: boolean = (this.props.path !== "") && (this.props.path.split(BrowserController.PATH_SEP).reverse()[0] === "genres");

    const onMoreClicked = () => {
      this.controller.goTo(this.props.path, "genres");
    };

    return <Accordion className="genres"
                      header={`Genres (${genres.length})`}
                      open={isAll}>
      <div className="item-container">
        {this.controller.getFirstN(genres,
                                   compareByName,
                                   isAll ? genres.length : BrowserController.PREVIEW_COUNT)
          .map((genre: IGenre, index: number) =>
                 <div className="genre item" key={index}>
                   <div className="name">{genre.name}</div>
                 </div>)}

        {!isAll && this.controller.hasMore(genres) && <div className="more" key="more" onClick={onMoreClicked}>More...</div>}
      </div>
    </Accordion>;
  }

  private renderPlaylists(): React.ReactNode
  {
    const playlists: IPlaylist[] = this.props.provider.playlists;

    if (playlists.length === 0)
    {
      return null;
    }

    const onMoreClicked = () => {
      this.controller.goTo(this.props.path, "playlists");
    };

    const isAll: boolean = (this.props.path !== "") && (this.props.path.split(BrowserController.PATH_SEP).reverse()[0] === "playlists");

    return <Accordion className="Playlists"
                      header={`Playlists (${playlists.length})`}
                      open={isAll}>

      <div className="item-container">
        {this.controller.getFirstN(playlists,
                                   compareByName,
                                   isAll ? playlists.length : BrowserController.PREVIEW_COUNT).map((playlist: IPlaylist) => {
          const genres: Set<IGenre> = new Set();
          playlist.tracks.forEach((track: ITrack) => track.genres.forEach((genre: IGenre) => genres.add(genre)));

          return <div className="playlist item" key={playlist.id}>
            <div className="playlist-name">{playlist.name}</div>
            <div className="genres">
              {this.controller.getFirstN([...genres], compareByName, 3)
                .map((genre: IGenre, index: number) => <div className="genre" key={`${index}`}>{genre.name}</div>)}
              {(genres.size > 3) && <div className="genre more">...</div>}
            </div>
          </div>;
        })}

        {!isAll && this.controller.hasMore(playlists) && <div className="more" key="more" onClick={onMoreClicked}>More...</div>}
      </div>
    </Accordion>;
  }

  private renderTracks(): React.ReactNode
  {
    const tracks: ITrack[] = this.props.provider.tracks;

    const onMoreClicked = () => {
      this.controller.goTo(this.props.path, "tracks");
    };

    const isAll: boolean = (this.props.path !== "") && (this.props.path.split(BrowserController.PATH_SEP).reverse()[0] === "tracks");

    return <Accordion className="tracks"
                      header={`Tracks (${tracks.length})`}
                      open={isAll}>
      <div className={"item-container"}>
        {this.controller.getFirstN(tracks,
                                   compareByName,
                                   isAll ? tracks.length : BrowserController.PREVIEW_COUNT)
          .map((track: ITrack) => <div className="track item" key={track.id}>
            <div className="track-name">{track.name}</div>
            <div className="album-name">{track.album?.name}</div>
            <div className="genres">
              {this.controller.getFirstN(track.genres, compareByName, 3)
                .map((genre: IGenre, index: number) => <div className="genre" key={`${index}`}>{genre.name}</div>)}
              {(track.genres.length > 3) && <div className="genre more">...</div>}
            </div>
          </div>)}
        {!isAll && this.controller.hasMore(tracks) && <div className="more" key="more" onClick={onMoreClicked}>More...</div>}
      </div>
    </Accordion>
  }

  public override componentDidMount(): void
  {
    this.controller.checkForData();
  }

}
