/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import * as React from "react";
import {useState} from "react";
import BrowserSection from "app/client/browser/BrowserSection";
import {compareByName} from "app/client/utils/ComparisonFunctions";
import {ITrack} from "app/client/model/Track";
import {BrowserController} from "app/client/browser/BrowserController";
import {BrowserProvider} from "app/client/browser/Browser";
import {IAlbum} from "app/client/model/Album";
import {IGenre} from "app/client/model/Genre";
import {IArtist} from "app/client/model/Artist";
import {IPlaylist} from "app/client/model/Playlist";
import {Album} from "app/client/browser/Album";
import {Playlist} from "app/client/browser/Playlist";
import {Artist} from "app/client/browser/Artist";
import {Genre} from "app/client/browser/Genre";
import {Track} from "app/client/browser/Track";
import {TracksSection} from "app/client/browser/TracksSection";
import AlbumsSection from "app/client/browser/AlbumsSection";

export interface BrowserBodyProps
{
  controller: BrowserController;
  provider: BrowserProvider;
  path: string;
}

export function BrowserBody(props: BrowserBodyProps)
{
  const [isAlbum, setIsAlbum] = useState(props.provider.browserProviderType === "album");
  const [isPlaylist, setIsPlaylist] = useState(props.provider.browserProviderType === "playlist");
  const [isArtist, setIsArtist] = useState(props.provider.browserProviderType === "artist");
  const [isGenre, setIsGenre] = useState(props.provider.browserProviderType === "genre");

  if (isAlbum !== (props.provider.browserProviderType === "album"))
  {
    setIsAlbum((props.provider.browserProviderType === "album"));
  }

  if (isPlaylist !== (props.provider.browserProviderType === "playlist"))
  {
    setIsPlaylist((props.provider.browserProviderType === "playlist"));
  }

  if (isArtist !== (props.provider.browserProviderType === "artist"))
  {
    setIsArtist((props.provider.browserProviderType === "artist"));
  }

  if (isGenre !== (props.provider.browserProviderType === "genre"))
  {
    setIsGenre((props.provider.browserProviderType === "genre"));
  }


  const renderFavorites = () => {
    return <BrowserSection className={"favorites"}
                           header={"Favorites"}
                           key={"favorites"}
                           controller={props.controller}
                           objects={props.provider.getFavorites()}
                           compare={compareByName}
                           render={(track: ITrack) => <Track track={track}
                                                             controller={props.controller}
                                                             type="cards"/>}/>;
  }

  const onAlbumClicked = (album: IAlbum) => () => {
    props.controller.gotoObject(props.path, "album", album.id);
  };

  const renderAlbums = () => {
    return <AlbumsSection className={"albums"}
                          key={"albums"}
                          controller={props.controller}
                          provider={props.provider}
                          onAlbumClicked={onAlbumClicked}
                          />;

  }

  const renderAlbum = () => {
    return <div className={"item-container cards"}>
      <Album album={props.provider.albums[0]}
                  controller={props.controller}/>
    </div>;
  }

  const onArtistClicked = (artist: IArtist) => () => {
    props.controller.gotoObject(props.path, "artist", artist.id);
  };

  const renderArtists = () => {
    return <BrowserSection className={"artists"}
                           header={"Artists"}
                           key={"artists"}
                           controller={props.controller}
                           objects={props.provider.artists.filter((artist: IArtist) => artist.name !== "")}
                           compare={compareByName}
                           render={(artist: IArtist) => <Artist artist={artist}
                                                                controller={props.controller}
                                                                onArtistClicked={onArtistClicked}/>}
                           />;
  }

  const renderArtist = () => {
    return <div className={"item-container cards"}>
      <Artist artist={props.provider.artists[0]}
             controller={props.controller}/>
    </div>;
  }

  const onGenreClicked = (genre: IGenre) => () => {
    props.controller.gotoObject(props.path, "genre", genre.name);
  };

  const renderGenres = () => {
    return <BrowserSection className={"genres"}
                           header={"Genres"}
                           key={"genres"}
                           controller={props.controller}
                           objects={props.provider.genres}
                           compare={compareByName}
                           render={(genre: IGenre) => <Genre genre={genre}
                                                             onGenreClicked={onGenreClicked}/>}
                             />;
  }

  const renderGenre = () => {
    return <div className={"item-container cards"}>
      <Genre genre={props.provider.genres[0]}/>
    </div>;
  }



  const onPlaylistClicked = (playlist: IPlaylist) => () => {
    props.controller.gotoObject(props.path, "playlist", playlist.id);
  };

  const renderPlaylists = () =>  {
    return <BrowserSection className={"playlists"}
                           header={"Playlists"}
                           key={"playlists"}
                           controller={props.controller}
                           objects={props.provider.playlists}
                           compare={compareByName}
                           render={(playlist: IPlaylist) => <Playlist playlist={playlist}
                                                                      controller={props.controller}
                                                                      onPlaylistClicked={onPlaylistClicked}/>}
                           />;
  }

  const renderPlaylist = () => {
    return <div className={"item-container cards"}>
      <Playlist playlist={props.provider.playlists[0]}
             controller={props.controller}/>
    </div>;
  }

  const renderTracks = () => <TracksSection isPlaylist={isPlaylist}
                                            controller={props.controller}
                                            provider={props.provider}
                                            isAlbum={isAlbum}/>;


  return <div className="browser">
    {isAlbum && renderAlbum()}
    {isPlaylist && renderPlaylist()}
    {isArtist && renderArtist()}
    {isGenre && renderGenre()}
    {renderFavorites()}
    {!isAlbum && renderAlbums()}
    {!isArtist && renderArtists()}
    {!isGenre && renderGenres()}
    {!isPlaylist && renderPlaylists()}
    {renderTracks()}
  </div>;
}
