/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IPlaylist} from "app/client/model/Playlist";
import {IGenre} from "app/client/model/Genre";
import {ITrack} from "app/client/model/Track";
import {GenresSection} from "app/client/browser/BrowserSection";
import * as React from "react";
import {BrowserController} from "app/client/browser/BrowserController";
import {SpotifyImage} from "spotify-web-api-ts/types/types/SpotifyObjects";
import {ModelUtils} from "app/client/utils/ModelUtils";

export interface PlaylistProps
{
  playlist: IPlaylist;
  controller: BrowserController;
  onPlaylistClicked?: (playlist: IPlaylist) => () => void;
}

export function Playlist(props: PlaylistProps)
{
  const genres: Set<IGenre> = new Set();
  props.playlist.tracks.forEach((track: ITrack) => track.genres.forEach((genre: IGenre) => genres.add(genre)));

  const image: SpotifyImage | undefined = ModelUtils.getImageNearSize(props.playlist.images, 300);

  return <div className="playlist item"
              key={props.playlist.id}
              onClick={props.onPlaylistClicked ? props.onPlaylistClicked(props.playlist) : undefined}>
    {image && <img width={image.width + "px"}
                   height={image.height + "px"}
                   src={image.url}
                   alt={props.playlist.name}
    />}
    <div className={"playlist-name"}>{props.playlist.name}</div>
    <GenresSection genres={[...genres]}
                   controller={props.controller}/>
  </div>;
}
