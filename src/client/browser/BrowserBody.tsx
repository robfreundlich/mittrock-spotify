/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import * as React from "react";
import BrowserSection, {GenresSection, ItemDisplayType} from "app/client/browser/BrowserSection";
import {compareByAddedAtDesc, compareByName} from "app/client/model/ComparisonFunctions";
import {ITrack} from "app/client/model/Track";
import {BrowserController} from "app/client/browser/BrowserController";
import {BrowserProvider} from "app/client/browser/Browser";
import {IAlbum} from "app/client/model/Album";
import {IGenre} from "app/client/model/Genre";
import {IArtist} from "app/client/model/Artist";
import {IPlaylist} from "app/client/model/Playlist";
import {AlbumTracksProvider} from "app/client/app/AlbumTracksProvider";
import {PlaylistTracksProvider} from "app/client/app/PlaylistTracksProvider";

export interface BrowserBodyProps
{
  controller: BrowserController;
  provider: BrowserProvider;
  path: string;
}

export function BrowserBody(props: BrowserBodyProps)
{
  const renderFavorites = () => {
    return <BrowserSection className={"favorites"}
                           headerText={"Favorites"}
                           key={"favorites"}
                           controller={props.controller}
                           objects={props.provider.getFavorites()}
                           compare={compareByAddedAtDesc}
                           render={(track: ITrack) => {
                             return <div className="track item" key={track.id}>
                               <div className="track-name">{track.name}</div>
                               <div className="album-name">{track.album?.name}</div>
                               <GenresSection genres={track.genres} controller={props.controller}/>
                             </div>;
                           }}/>;
  }

  const onAlbumClicked = (album: IAlbum) => () => {
    props.controller.gotoObject(props.path, "album", album.id);
  };

  const renderAlbums = () => {
    return <BrowserSection className={"albums"}
                           headerText={"Albums"}
                           key={"albums"}
                           controller={props.controller}
                           objects={props.provider.albums}
                           compare={compareByAddedAtDesc}
                           render={(album: IAlbum) => {
                             const genres: Set<IGenre> = new Set();
                             album.tracks.forEach((track: ITrack) => track.genres
                               .forEach((genre: IGenre) => genres.add(genre)));

                             return <div className="album item" key={album.id}>
                               <div className="album-name" onClick={onAlbumClicked(album)}>{album.name}</div>
                               <GenresSection genres={[ ...genres ]} controller={props.controller}/>
                             </div>;
                           }}/>;
  }

  const onArtistClicked = (artist: IArtist) => () => {
    props.controller.gotoObject(props.path, "artist", artist.id);
  };

  const renderArtists = () => {
    return <BrowserSection className={"artists"}
                           headerText={"Artists"}
                           key={"artists"}
                           controller={props.controller}
                           objects={props.provider.artists.filter((artist: IArtist) => artist.name !== "")}
                           compare={compareByName}
                           render={(artist: IArtist) => {
                             return <div className="artist item"
                                         key={artist.id}
                                         onClick={onArtistClicked(artist)}
                             >
                               <div className="artist-name">{artist.name}</div>
                               <GenresSection genres={artist.genres}
                                              controller={props.controller}/>
                             </div>;
                           }}/>
  }

  const onGenreClicked = (genre: IGenre) => () => {
    props.controller.gotoObject(props.path, "genre", genre.name);
  };

  const renderGenres = () => {
    return <BrowserSection className={"genres"}
                           headerText={"Genres"}
                           key={"genres"}
                           controller={props.controller}
                           objects={props.provider.genres}
                           compare={compareByName}
                           render={(genre: IGenre) => {
                             return <div className="genre item"
                                         key={genre.name}
                                         onClick={onGenreClicked(genre)}
                             >
                               <div className="name">{genre.name}</div>
                             </div>;
                           }}/>;
  }

  const onPlaylistClicked = (playlist: IPlaylist) => () => {
    props.controller.gotoObject(props.path, "playlist", playlist.id);
  };

  const renderPlaylists = () =>  {
    return <BrowserSection className={"playlists"}
                           headerText={"Playlists"}
                           key={"playlists"}
                           controller={props.controller}
                           objects={props.provider.playlists}
                           compare={compareByName}
                           render={(playlist: IPlaylist) => {
                             const genres: Set<IGenre> = new Set();
                             playlist.tracks.forEach((track: ITrack) => track.genres.forEach((genre: IGenre) => genres.add(genre)));
                             return <div className="playlist item"
                                         key={playlist.id}
                                         onClick={onPlaylistClicked(playlist)}
                             >
                               <div className="playlist-name">{playlist.name}</div>
                               <GenresSection genres={[... genres]}
                                              controller={props.controller}/>
                             </div>;
                           }}/>;
  }

  const renderTracks = () => {
    const type: ItemDisplayType = (props.provider instanceof AlbumTracksProvider) || (props.provider instanceof PlaylistTracksProvider)
      ? "rows"
      : "cards";

    return <BrowserSection className={"tracks"}
                           type={type}
                           headerText={"Tracks"}
                           key={"tracks"}
                           controller={props.controller}
                           objects={props.provider.tracks}
                           compare={props.provider.compareTracks ?? compareByName}
                           render={(track: ITrack) => {
                             return <div className="track item" key={track.id}>
                               <div className="track-name">{track.name}</div>
                               <div className="album-name">{track.album?.name}</div>
                               <GenresSection genres={track.genres}
                                              controller={props.controller}
                                              type={type}/>
                             </div>;
                           }}/>;
  }
  
  
  return <div className="browser">
    {renderFavorites()}
    {renderAlbums()}
    {renderArtists()}
    {renderGenres()}
    {renderPlaylists()}
    {renderTracks()}
  </div>;
}
