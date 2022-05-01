/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IAlbum} from "app/client/model/Album";
import {IFavorites} from "app/client/model/Favorites";
import {IPlaylist} from "app/client/model/Playlist";

export type TrackSource = "favorite" | "album" | "playlist";

export interface ITrackSource
{
  sourceType: TrackSource;
}

export const isAlbum = (trackSource: any): trackSource is IAlbum => {
  return trackSource.sourceType === "album";
};

export const isPlaylist = (trackSource: any): trackSource is IPlaylist => {
  return trackSource.sourceType === "playlist";
};

export const isFavorites = (trackSource: any): trackSource is IFavorites => {
  return trackSource.sourceType === "Favorites";
};

