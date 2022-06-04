/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IdentifiedObject} from "app/client/model/IdentifiedObject";

export type AlbumType = "album" | "single" | "compilation";

export type ReleaseDatePrecision = "year" | "month" | "day";

export type Explicitness = "explicit" | "clean";

export type TrackStorageOrigin = "local" | "streaming";

export type Visibility = "private" | "public";

type InclusionReasonFavorite = "favorite";

export const INCLUSTION_REASON_FAVORITE: InclusionReasonFavorite = "favorite";

export type InclusionReason = InclusionReasonFavorite | IdentifiedObject;
