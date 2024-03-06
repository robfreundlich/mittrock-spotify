/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IAlbum} from "app/client/model/Album";
import {IGenre} from "app/client/model/Genre";
import {ITrack} from "app/client/model/Track";
import {GenresSection} from "app/client/browser/BrowserSection";
import * as React from "react";
import {BrowserController} from "app/client/browser/BrowserController";

export interface AlbumProps
{
  album: IAlbum;
  controller: BrowserController;

  onAlbumClicked?: (album: IAlbum) => () => void;
}

export function Album(props: AlbumProps)
{
  const genres: Set<IGenre> = new Set();
  props.album.tracks.forEach((track: ITrack) => track.genres
    .forEach((genre: IGenre) => genres.add(genre)));

  return <div className="album item" key={props.album.id}>
    <div className="album-name"
         onClick={props.onAlbumClicked ? props.onAlbumClicked(props.album) : undefined}>
      {props.album.name}
    </div>
    <GenresSection genres={[...genres]} controller={props.controller}/>
  </div>;
}
