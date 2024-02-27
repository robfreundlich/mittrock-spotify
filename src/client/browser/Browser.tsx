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

interface BrowserProps
{
  dataStore: DataStore;

  router: UIRouterReact;
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
    if (!this.props.dataStore.tracks)
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
    return <>
      <div className="track-count">
        {this.props.dataStore.tracks.length} Tracks
      </div>
      {/*{this.renderTrackLoaderButton()}*/}
      <div className="app-state">
        {/*{this.controller.state}*/}
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
    </div>;
  }

  private renderFavorites(): React.ReactNode
  {
    const favorites: ITrack[] = this.props.dataStore.getFavorites();

    return <Accordion className="favorites"
                      header={`Favorites (${favorites.length})`}
                      open={true}>
      <div className="tracks item-container">
        {this.controller.getFirstN(favorites, compareByAddedAtDesc)
          .map((track: ITrack) => <div className="track item" key={track.id}>
            <div className="track-name">{track.name}</div>
            <div className="album-name">{track.album?.name}</div>
            <div className="genres">
              {this.controller.getFirstN(track.genres, compareByName, 3)
                .map((genre: IGenre, index: number) => <div className="genre" key={`${index}`}>{genre.name}</div>)}
              {(track.genres.length > 3) && <div className="genre more">...</div>}
            </div>
          </div>)}

        {this.controller.hasMore(favorites) && <div className="more" key="more">More...</div>}
      </div>
    </Accordion>;
  }

  private renderAlbums(): React.ReactNode
  {
    const albums: IAlbum[] = this.props.dataStore.albums;

    return <Accordion className="albums"
                      header={`Albums (${albums.length})`}>
      <div className="item-container">
        {this.controller.getFirstN(albums, compareByAddedAtDesc).map((album: IAlbum) => {
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

        {this.controller.hasMore(albums) && <div className="more" key="more">More...</div>}
      </div>
    </Accordion>;
  }

  private renderArtists(): React.ReactNode
  {
    const artists: IArtist[] = this.props.dataStore.artists.filter((artist: IArtist) => artist.name !== "");

    return <Accordion className="artists"
      header={`Artists (${artists.length})`}>
      <div className="item-container">
        {this.controller.getFirstN(artists, compareByName).map((artist: IArtist) =>
                                                                   <div className="artist item" key={artist.id}>
                                                                     <div className="artist-name">{artist.name}</div>
                                                                     <div className="genres">
                                                                       {this.controller.getFirstN(artist.genres, compareByName, 3)
                                                                            .map((genre: IGenre, index: number) => <div className="genre"
                                                                                                                        key={index}>{genre.name}</div>)}
                                                                       {(artist.genres.length > 3) && <div className="genre more">...</div>}
                                                                     </div>
                                                                   </div>)}

        {this.controller.hasMore(artists) && <div className="more" key="more">More...</div>}
      </div>
    </Accordion>;
  }

  private renderGenres(): React.ReactNode
  {
    const genres: IGenre[] = this.props.dataStore.genres;
    return <Accordion className="genres"
                      header={`Genres (${genres.length})`}>
      <div className="item-container">
        {this.controller.getFirstN(genres, compareByName).map((genre: IGenre, index: number) =>
                                                                  <div className="genre item" key={index}>
                                                                    <div className="name">{genre.name}</div>
                                                                  </div>)}

        {this.controller.hasMore(genres) && <div className="more" key="more">More...</div>}
      </div>
    </Accordion>;
  }

  private renderPlaylists(): React.ReactNode
  {
    const playlists: IPlaylist[] = this.props.dataStore.playlists;

    return <Accordion className="Playlists"
      header={`Playlists (${playlists.length})`}>

      <div className="item-container">
        {this.controller.getFirstN(playlists, compareByName).map((playlist: IPlaylist) => {
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

        {this.controller.hasMore(playlists) && <div className="more" key="more">More...</div>}
      </div>
    </Accordion>;
  }

  public override componentDidMount(): void
  {
    this.controller.checkForData();
  }

}
