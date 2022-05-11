/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {BrowserController} from "app/client/browser/BrowserController";
import {DataStore} from "app/client/model/DataStore";
import {ITrack} from "app/client/model/Track";
import * as React from "react";

interface BrowserProps
{
  dataStore: DataStore;
}

export class Browser extends React.Component<BrowserProps>
{
  private controller: BrowserController;

  constructor(props: Readonly<BrowserProps> | BrowserProps)
  {
    super(props);
    this.controller = new BrowserController(props.dataStore);
  }

  /*
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

   */
  public override render()
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
    const favorites: ITrack[] = this.controller.dataStore.getFavorites();

    return <>
      <h1>Favorites ({favorites.length})</h1>

      <div className="favorites tracks">
        {favorites.slice(0, Math.min(favorites.length, 8)).map((track: ITrack) => <div className="track" key={track.id}>
          <div className="track-name">{track.name}</div>
          <div className="track-album">{track.album?.name}</div>
          <div className="track-genre">{track.genres.map(genre => genre.name).join(",")}</div>
        </div>)}
      </div>
    </>;
  }

  private renderAlbums(): React.ReactNode
  {
    return <div className="Albums">
      <h1>Albums ({this.controller.dataStore.albums.length})</h1>
    </div>;
  }

  private renderArtists(): React.ReactNode
  {
    return <div className="Artists">
      <h1>Artists ({this.controller.dataStore.artists.length})</h1>
    </div>;
  }

  private renderGenres(): React.ReactNode
  {
    return <div className="Genres">
      <h1>Genres ({this.controller.dataStore.genres.length})</h1>
    </div>;
  }

  private renderPlaylists(): React.ReactNode
  {
    return <div className="Playlists">
      <h1>Playlists ({this.controller.dataStore.playlists.length})</h1>
    </div>;
  }

}
