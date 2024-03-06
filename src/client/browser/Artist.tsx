/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {GenresSection} from "app/client/browser/BrowserSection";
import * as React from "react";
import {IArtist} from "app/client/model/Artist";
import {BrowserController} from "app/client/browser/BrowserController";

export interface ArtistProps
{
  artist: IArtist;
  controller: BrowserController;

  onArtistClicked?: (artist: IArtist) => () => void;
}

export function Artist(props: ArtistProps)
{
  return <div className="artist item"
              key={props.artist.id}
              onClick={props.onArtistClicked && props.onArtistClicked(props.artist)}>
    <div className="artist-name">{props.artist.name}</div>
    <GenresSection genres={props.artist.genres}
                   controller={props.controller}/>
  </div>;
}
