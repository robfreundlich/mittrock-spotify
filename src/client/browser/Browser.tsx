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

    return <div className="favorites">
      <h1>Favorites ({favorites.length})</h1>

      <div className="tracks item-container">
        {this.controller.getFirstN(favorites)
             .map((track: ITrack) => <div className="track item" key={track.id}>
               <div className="track-name">{track.name}</div>
               <div className="album-name">{track.album?.name}</div>
               <div className="genres">
                 {this.controller.getFirstN(track.genres, 3)
                      .map((genre: IGenre, index: number) => <div className="genre" key={`${index}`}>{genre.name}</div>)}
                 {(track.genres.length > 3) && <div className="genre more">...</div>}
               </div>
             </div>)}

        {this.controller.hasMore(favorites) && <div className="more" key="more">More...</div>}
      </div>
    </div>;
  }

  private renderAlbums(): React.ReactNode
  {
    const albums: IAlbum[] = this.props.dataStore.albums;

    return <div className="albums">
      <h1>Albums ({albums.length})</h1>

      <div className="item-container">
        {this.controller.getFirstN(albums).map((album: IAlbum) => {
          const genres: Set<IGenre> = new Set();
          album.tracks.forEach((track: ITrack) => track.genres.forEach((genre: IGenre) => genres.add(genre)));

          return <div className="album item" key={album.id}>
            <div className="album-name">{album.name}</div>
            <div className="genres">
              {this.controller.getFirstN([...genres], 3)
                   .map((genre: IGenre, index: number) => <div className="genre" key={`${index}`}>{genre.name}</div>)}
              {(genres.size > 3) && <div className="genre more">...</div>}
            </div>
          </div>;
        })}

        {this.controller.hasMore(albums) && <div className="more" key="more">More...</div>}
      </div>
    </div>;
  }

  private renderArtists(): React.ReactNode
  {
    const artists: IArtist[] = this.props.dataStore.artists;

    return <div className="artists">
      <h1>Artists ({artists.length})</h1>

      <div className="item-container">
        {this.controller.getFirstN(artists).map((artist: IArtist) =>
                                                    <div className="artist item" key={artist.id}>
                                                      <div className="artist-name">{artist.name}</div>
                                                      <div className="genres">
                                                        {this.controller.getFirstN(artist.genres, 3)
                                                             .map((genre: IGenre, index: number) => <div className="genre" key={index}>{genre.name}</div>)}
                                                        {(artist.genres.length > 3) && <div className="genre more">...</div>}
                                                      </div>
                                                    </div>)}

        {this.controller.hasMore(artists) && <div className="more" key="more">More...</div>}
      </div>
    </div>;
  }

  private renderGenres(): React.ReactNode
  {
    const genres: IGenre[] = this.props.dataStore.genres;
    return <div className="genres">

      <h1>Genres ({genres.length})</h1>
      <div className="item-container">
        {this.controller.getFirstN(genres).map((genre: IGenre, index: number) =>
                                                   <div className="genre item" key={index}>
                                                     <div className="name">{genre.name}</div>
                                                   </div>)}

        {this.controller.hasMore(genres) && <div className="more" key="more">More...</div>}
      </div>
    </div>;
  }

  private renderPlaylists(): React.ReactNode
  {
    const playlists: IPlaylist[] = this.props.dataStore.playlists;

    return <div className="Playlists">
      <h1>Playlists ({playlists.length})</h1>

      <div className="item-container">
        {this.controller.getFirstN(playlists).map((playlist: IPlaylist) => {
          const genres: Set<IGenre> = new Set();
          playlist.tracks.forEach((track: ITrack) => track.genres.forEach((genre: IGenre) => genres.add(genre)));

          return <div className="playlist item" key={playlist.id}>
            <div className="playlist-name">{playlist.name}</div>
            <div className="genres">
              {this.controller.getFirstN([...genres], 3)
                   .map((genre: IGenre, index: number) => <div className="genre" key={`${index}`}>{genre.name}</div>)}
              {(genres.size > 3) && <div className="genre more">...</div>}
            </div>
          </div>;
        })}

        {this.controller.hasMore(playlists) && <div className="more" key="more">More...</div>}
      </div>
    </div>;
  }

  public override componentDidMount(): void
  {
    this.controller.checkForData();
  }

}
