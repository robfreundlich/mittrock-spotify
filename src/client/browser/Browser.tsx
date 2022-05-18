/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {UIRouterReact} from "@uirouter/react";
import {BrowserController} from "app/client/browser/BrowserController";
import {IAlbum} from "app/client/model/Album";
import {DataStore} from "app/client/model/DataStore";
import {IGenre} from "app/client/model/Genre";
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

  /*
   <div className="favorites-container container item">
   <div className="label">Favorites</div>
   <div className="data">{this.props.props.dataStore.numFavoriteTracks}</div>
   </div>

   <div className="albums-container container">
   <div className="albums item">
   <div className="label">Albums</div>
   <div className="data">{this.props.props.dataStore.albums.length}</div>
   </div>
   <div className="tracks item">
   <div className="label">Tracks</div>
   <div className="data">{this.props.props.dataStore.numAlbumTracks}</div>
   </div>
   </div>

   <div className="playlists-container container">
   <div className="playlists item">
   <div className="label">Playlists</div>
   <div className="data">{this.props.props.dataStore.playlists.length}</div>
   </div>
   <div className="tracks item">
   <div className="label">Tracks</div>
   <div className="data">{this.props.props.dataStore.numPlaylistTracks}</div>
   </div>
   </div>

   <div className="totals-container container">
   <div className="total-tracks item">
   <div className="label">Total tracks</div>
   <div className="data">{this.props.props.dataStore.tracks.length}</div>

   */

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

    return <>
      <h1>Favorites ({favorites.length})</h1>

      <div className="favorites tracks">
        {this.controller.getFirstN(favorites)
             .map((track: ITrack) => <div className="track" key={track.id}>
               <div className="track-name">{track.name}</div>
               <div className="track-album">{track.album?.name}</div>
               <div className="track-genres">
                 {this.controller.getFirstN(track.genres, 3)
                      .map(genre => <div className="genre">{genre.name}</div>)}
                 {(track.genres.length > 3) && <div className="genre more">...</div>}
               </div>
             </div>)}
      </div>
    </>;
  }

  private renderAlbums(): React.ReactNode
  {
    const albums: IAlbum[] = this.props.dataStore.albums;

    return <>
      <h1>Albums ({this.props.dataStore.albums.length})</h1>

      <div className="albums">
        {this.controller.getFirstN(albums).map((album: IAlbum) => {
          const genres: Set<IGenre> = new Set();
          album.tracks.forEach((track: ITrack) => track.genres.forEach((genre: IGenre) => genres.add(genre)));

          return <div className="album" key={album.id}>
            <div className="album-name">{album.name}</div>
            <div className="album-genres">
              {this.controller.getFirstN([...genres], 3)
                   .map(genre => <div className="genre">{genre.name}</div>)}
              {(genres.size > 3) && <div className="genre more">...</div>}
            </div>
          </div>;
        })}
      </div>
    </>;
  }

  private renderArtists(): React.ReactNode
  {
    return <div className="Artists">
      <h1>Artists ({this.props.dataStore.artists.length})</h1>
    </div>;
  }

  private renderGenres(): React.ReactNode
  {
    return <div className="Genres">
      <h1>Genres ({this.props.dataStore.genres.length})</h1>
    </div>;
  }

  private renderPlaylists(): React.ReactNode
  {
    return <div className="Playlists">
      <h1>Playlists ({this.props.dataStore.playlists.length})</h1>
    </div>;
  }

  public override componentDidMount(): void
  {
    this.controller.checkForData();
  }

}
