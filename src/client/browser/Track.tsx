/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {GenresSection, ItemDisplayType} from "app/client/browser/BrowserSection";
import * as React from "react";
import {BrowserController} from "app/client/browser/BrowserController";
import {ITrack} from "app/client/model/Track";
import {SpotifyImage} from "spotify-web-api-ts/types/types/SpotifyObjects";
import {ModelUtils} from "app/client/utils/ModelUtils";

interface TrackProps
{
  track: ITrack;
  controller: BrowserController;
  type: ItemDisplayType;
}

export function Track(props: TrackProps)
{
  const images: SpotifyImage[] = props.track.images ?? [];

  const image: SpotifyImage | undefined = ModelUtils.getImageNearSize(images, 64);

  return <div className="track item" key={props.track.id}>
    <div className="track-number">{props.track.track_number}</div>
    <div className="track-image">
      {image && <img width={image.width + "px"}
                     height={image.height + "px"}
                     src={image.url}
                     alt={props.track.album?.name}
      />}
    </div>
    <div className="track-name">{props.track.name}</div>
    <div className={"track-artist"}>{props.track.artists.map((artist) => artist.name).join(",")}</div>
    <GenresSection genres={props.track.genres}
                   controller={props.controller}
                   type={props.type}/>
  </div>;
}
