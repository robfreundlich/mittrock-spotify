/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IAlbum} from "app/client/model/Album";
import {IGenre} from "app/client/model/Genre";
import {ITrack} from "app/client/model/Track";
import {GenresSection} from "app/client/browser/BrowserSection";
import * as React from "react";
import {BrowserController} from "app/client/browser/BrowserController";
import {SpotifyImage} from "spotify-web-api-ts/types/types/SpotifyObjects";
import {ModelUtils} from "app/client/utils/ModelUtils";
import Popup from "reactjs-popup";
import {inclusionReasonObjectName} from "app/client/utils/Types";

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

  const image: SpotifyImage | undefined = ModelUtils.getImageNearSize(props.album.images, 300);

  return <div className={`album item ${props.album.tracks.length > 0 ? "favorite-album" : ""}`}
              key={props.album.id}
              onClick={props.onAlbumClicked ? props.onAlbumClicked(props.album) : undefined}
              title={props.album.name}>
    {image && <img width={image.width + "px"}
                   height={image.height + "px"}
                   src={image.url}
                   alt={props.album.name}
    />}
    {!image && <div className={"album-name"}>{props.album.name}</div>}
    <GenresSection genres={[...genres]} controller={props.controller}/>
    <Popup trigger={<button>Details</button>}
           position={"center center"}
           className="details-popup">
      <form className="details">
        <label htmlFor="name">Name</label>
        <input type="text" readOnly={true} name="name" value={props.album.name}/>

        <label htmlFor="artist">Artist</label>
        <input type="text" readOnly={true} name="artist" value={props.album.artists.map((a) => a.name).join(",")}/>

        <label htmlFor="inclusionReasons">InclusionReasons</label>
        <textarea name="inclusionReasons" readOnly={true} rows={3} cols={40}>
          {props.album.inclusionReasons.map((reason) => inclusionReasonObjectName(reason, props.controller.dataStore))}
        </textarea>
      </form>
    </Popup>
  </div>;
}
