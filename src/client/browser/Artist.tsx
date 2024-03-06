/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {GenresSection} from "app/client/browser/BrowserSection";
import * as React from "react";
import {IArtist} from "app/client/model/Artist";
import {BrowserController} from "app/client/browser/BrowserController";
import {SpotifyImage} from "spotify-web-api-ts/types/types/SpotifyObjects";
import {ModelUtils} from "app/client/utils/ModelUtils";

export interface ArtistProps
{
  artist: IArtist;
  controller: BrowserController;

  onArtistClicked?: (artist: IArtist) => () => void;
}

export function Artist(props: ArtistProps)
{
  const image: SpotifyImage | undefined = ModelUtils.getImageNearSize(props.artist.images, 300);

  return <div className="artist item"
              key={props.artist.id}
              onClick={props.onArtistClicked && props.onArtistClicked(props.artist)}>
    {image && <img width={image.width + "px"}
                   height={image.height + "px"}
                   src={image.url}
                   alt={props.artist.name}
    />}
    <div className={"artist-name"}>{props.artist.name}</div>
    <GenresSection genres={props.artist.genres}
                   controller={props.controller}/>
  </div>;
}
