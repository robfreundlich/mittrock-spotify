/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IAlbum} from "app/client/model/Album";
import {IFavorites} from "app/client/model/Favorites";
import {IPlaylist} from "app/client/model/Playlist";
import {ITrack} from "app/client/model/Track";

export type TrackSource = IAlbum | IPlaylist | IFavorites;

export type TrackSourceType = "favorite" | "album" | "playlist";

export interface ITrackSource
{
  sourceType: TrackSourceType;
}

export const isAlbum = (trackSource: TrackSource): trackSource is IAlbum => {
  return trackSource.sourceType === "album";
};

export const isTrackAlbum = (track: ITrack): boolean => {
  return track.sources.some((source) => isAlbum(source));
}

export const isPlaylist = (trackSource: TrackSource): trackSource is IPlaylist => {
  return trackSource.sourceType === "playlist";
};

export const isTrackPlaylist = (track: ITrack): boolean => {
  return track.sources.some((source) => isPlaylist(source));
}

export const isFavorites = (trackSource: TrackSource): trackSource is IFavorites => {
  return trackSource.sourceType === "favorite";
};

export const isTrackFavorite = (track: ITrack): boolean => {
  return track.sources.some((source) => isFavorites(source));
}

