/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import React, {useState} from 'react';
import BrowserSection from "app/client/browser/BrowserSection";
import {compareByName} from "app/client/utils/ComparisonFunctions";
import {IAlbum} from "app/client/model/Album";
import {BrowserController} from "app/client/browser/BrowserController";
import {BrowserProvider} from "app/client/browser/Browser";
import {Album} from "app/client/browser/Album";
import {isObjectFavorite, isObjectFromFavoriteTrack, isObjectFromPlaylistTrack} from "app/client/model/TrackSource";
import {ToggleButton} from "app/client/controls/ToggleButton";

interface AlbumsSectionProps
{
  className?: string;
  provider: BrowserProvider;
  controller: BrowserController;
  onAlbumClicked: (album: IAlbum) => () => void;
}

function AlbumsSection(props: AlbumsSectionProps)
{
  const [includeFavorites, setIncludeFavorites] = useState(true);
  const [includePlaylistTracks, setIncludePlaylistTracks] = useState(true);
  const [includeFavoriteTracks, setIncludeFavoriteTracks] = useState(true)

  const favorites = props.provider.albums.filter((album) => isObjectFavorite(album));
  const fromPlaylists = props.provider.albums.filter((album) => isObjectFromPlaylistTrack(album));
  const fromFavoriteTracks = props.provider.albums.filter((album) => isObjectFromFavoriteTrack(album));

  const filteredAlbums: IAlbum[] = props.provider.albums.filter((album: IAlbum) => {
    if (includeFavorites && (favorites.indexOf(album) !== -1))
    {
      return true;
    }

    if (includePlaylistTracks && (fromPlaylists.indexOf(album) !== -1))
    {
      return true;
    }

    if (includeFavoriteTracks && (fromFavoriteTracks.indexOf(album) !== -1))
    {
      return true;
    }

    return false;
  });

  const header: React.ReactNode = <div className="albums-header">
    <ToggleButton className="albums-option-favorites"
                  content={`Favorites (${favorites.length})`}
                  value={includeFavorites}
                  onValueChanged={(value) => setIncludeFavorites(value)}/>
    <ToggleButton className="albums-option-favorite-tracks"
                  content={`From favorite tracks (${fromFavoriteTracks.length})`}
                  value={includeFavoriteTracks}
                  onValueChanged={(value) => setIncludeFavoriteTracks(value)}/>
    <ToggleButton className="albums-option-playlists"
                  content={`From playlist tracks (${fromPlaylists.length})`}
                  value={includePlaylistTracks}
                  onValueChanged={(value) => setIncludePlaylistTracks(value)}/>
  </div>;

  return <BrowserSection className={`albums ${props.className ?? ""}`}
                         label={"Albums"}
                         controller={props.controller}
                         objects={filteredAlbums}
                         compare={compareByName}
                         render={(album: IAlbum) => <Album album={album}
                                                           controller={props.controller}
                                                           onAlbumClicked={props.onAlbumClicked}/>
                         }
                         header={header}
  />;
}

export default AlbumsSection;