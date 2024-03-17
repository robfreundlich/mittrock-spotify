/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {DataStore} from "app/client/model/DataStore";
import {IdentifiedObject} from "app/client/model/IdentifiedObject";

export type AlbumType = "album" | "single" | "compilation";

export type ReleaseDatePrecision = "year" | "month" | "day";

export type Explicitness = "explicit" | "clean";

export type TrackStorageOrigin = "local" | "streaming";

export type Visibility = "private" | "public";

type InclusionReasonFavorite = "favorite";

export const INCLUSION_REASON_FAVORITE: InclusionReasonFavorite = "favorite";

export type InclusionReasonType = "playlist"
  | "favorite_track"
  | "playlist_track"
  | "favorite_album"
  | "playlist_track_album";

export type InclusionReasonObject = { type: InclusionReasonType, id: string };

export type InclusionReason = InclusionReasonFavorite | InclusionReasonObject;

export const compareInclusionReasons = (a: InclusionReason, b: InclusionReason) => {
  if ((a === INCLUSION_REASON_FAVORITE) && (b === INCLUSION_REASON_FAVORITE))
  {
    return 0;
  }

  if (a === INCLUSION_REASON_FAVORITE && b !== INCLUSION_REASON_FAVORITE) {
      return -1;
  }
  if (a !== INCLUSION_REASON_FAVORITE && b === INCLUSION_REASON_FAVORITE) {
      return 1;
  }

  const aObject: InclusionReasonObject = a as InclusionReasonObject;
  const bObject: InclusionReasonObject = b as InclusionReasonObject;

  if (aObject.type === bObject.type)
  {
    return aObject.id.localeCompare(bObject.id);
  }

  return aObject.type.localeCompare(bObject.type);
}

export const areInclusionReasonsSame = (a: InclusionReason, b: InclusionReason) => {
  return compareInclusionReasons(a, b) === 0;
}

export const inclusionReasonObject = (reason: InclusionReason, dataStore: DataStore): InclusionReasonFavorite | IdentifiedObject | undefined => {
  if (reason === INCLUSION_REASON_FAVORITE)
  {
    return INCLUSION_REASON_FAVORITE;
  }

  switch (reason.type)
  {
    case "playlist":
      return dataStore.getPlaylist(reason.id);

    case "favorite_track":
      return dataStore.getTrack(reason.id);

    case "playlist_track":
      return dataStore.getTrack(reason.id);

    case "favorite_album":
      return dataStore.getAlbum(reason.id);

    case "playlist_track_album":
      return dataStore.getAlbum(reason.id);
  }
}

export const inclusionReasonObjectName = (reason: InclusionReason, dataStore: DataStore): string => {
  const object: "favorite" | IdentifiedObject | undefined = inclusionReasonObject(reason, dataStore);

  if (!object)
  {
    return "Unknown";
  }

  if (object === "favorite")
  {
    return object;
  }

  return `${(reason as InclusionReasonObject).type}: ${object.name}`;
}
