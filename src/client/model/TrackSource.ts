/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IAlbum} from "app/client/model/Album";
import {IFavorites} from "app/client/model/Favorites";
import {IPlaylist} from "app/client/model/Playlist";
import {ITrack} from "app/client/model/Track";
import {INCLUSION_REASON_FAVORITE, InclusionReason} from "app/client/utils/Types";

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

export const isTrackAlbum = (track: ITrack): boolean => {
  return track.inclusionReasons.some((reason) => isAlbum(reason));
}

export const isPlaylist = (reason: InclusionReason): boolean => {
  return (reason !== INCLUSION_REASON_FAVORITE) && (reason.type === "playlist");
};

export const isTrackPlaylist = (track: ITrack): boolean => {
  return track.inclusionReasons.some((source) => isPlaylist(source));
}

export const isFavorites = (reason: InclusionReason): boolean => {
  return reason === INCLUSION_REASON_FAVORITE;
};

export const isTrackFavorite = (track: ITrack): boolean => {
  return track.inclusionReasons.some((reason) => isFavorites(reason));
}

