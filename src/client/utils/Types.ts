/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

export type AlbumType = "album" | "single" | "compilation";

export type ReleaseDatePrecision = "year" | "month" | "day";

export type Explicitness = "explicit" | "clean";

export type TrackStorageOrigin = "local" | "streaming";

export type Visibility = "private" | "public";

type InclusionReasonFavorite = "favorite";

export const INCLUSION_REASON_FAVORITE: InclusionReasonFavorite = "favorite";

export type InclusionReasonObject = { type: string, id: string };

export type InclusionReason = InclusionReasonFavorite | InclusionReasonObject;
