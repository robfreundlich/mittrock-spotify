/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IAlbum} from "app/client/model/Album";
import {IFavorites} from "app/client/model/Favorites";
import {IPlaylist} from "app/client/model/Playlist";
import {INCLUSION_REASON_FAVORITE, InclusionReason} from "app/client/utils/Types";
import {IncludedObject} from "app/client/model/IncludedObject";

export type TrackSource = IAlbum | IPlaylist | IFavorites;

export type TrackSourceType = "favorite" | "album" | "playlist";

export interface ITrackSource
{
  sourceType: TrackSourceType;
}

export const isAlbum = (reason: InclusionReason): boolean => {
  return (reason !== INCLUSION_REASON_FAVORITE)
    && ((reason.type === "favorite_album") || (reason.type === "playlist_track_album"));
};

export const isObjectFromAlbum = (object: IncludedObject): boolean => {
  return object.inclusionReasons.some((reason) => isAlbum(reason));
}

export const isPlaylist = (reason: InclusionReason): boolean => {
  return (reason !== INCLUSION_REASON_FAVORITE) && (reason.type === "playlist");
};

export const isObjectFromPlaylist = (object: IncludedObject): boolean => {
  return object.inclusionReasons.some((source) => isPlaylist(source));
}

export const isFavorites = (reason: InclusionReason): boolean => {
  return reason === INCLUSION_REASON_FAVORITE;
};

export const isObjectFavorite = (object: IncludedObject): boolean => {
  return object.inclusionReasons.some((reason) => isFavorites(reason));
}

export const isFavoriteTrack = (reason: InclusionReason): boolean => {
  return (reason !== INCLUSION_REASON_FAVORITE) && (reason.type === "favorite_track");
};

export const isObjectFromFavoriteTrack = (object: IncludedObject): boolean => {
  return object.inclusionReasons.some((source) => isFavoriteTrack(source));
}

export const isPlaylistTrack = (reason: InclusionReason): boolean => {
  return (reason !== INCLUSION_REASON_FAVORITE) && (reason.type === "playlist_track");
};

export const isObjectFromPlaylistTrack = (object: IncludedObject): boolean => {
  return object.inclusionReasons.some((source) => isPlaylistTrack(source));
}
