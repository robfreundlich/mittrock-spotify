/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import React from 'react';
import BrowserSection from "app/client/browser/BrowserSection";
import {compareByName} from "app/client/utils/ComparisonFunctions";
import {IAlbum} from "app/client/model/Album";
import {BrowserController} from "app/client/browser/BrowserController";
import {BrowserProvider} from "app/client/browser/Browser";
import {Album} from "app/client/browser/Album";

interface AlbumsSectionProps
{
  className?: string;
  provider: BrowserProvider;
  controller: BrowserController;
  onAlbumClicked: (album: IAlbum) => () => void;
}

function AlbumsSection(props: AlbumsSectionProps)
{
  // const favorites = props.provider.albums.filter((album) => album.sourceType

//    <ToggleButton content={`Favorites (${props.provider.albums.length})`} value={} onValueChanged={}
  const header = <span className={"albums-header"}>
    <span>{`Albums (${props.provider.albums.length})`}</span>
  </span>;

  return <BrowserSection className={`albums ${props.className ?? ""}`}
                         header={header}
                         controller={props.controller}
                         objects={props.provider.albums}
                         compare={compareByName}
                         render={(album: IAlbum) => <Album album={album}
                                                           controller={props.controller}
                                                           onAlbumClicked={props.onAlbumClicked}/>
                         }/>;
}

export default AlbumsSection;