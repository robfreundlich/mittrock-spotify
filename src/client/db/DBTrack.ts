/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IdentifiedObject} from "app/client/model/IdentifiedObject";
import {IncludedObject} from "app/client/model/IncludedObject";
import {Track} from "spotify-web-api-ts/src/types/SpotifyObjects";

export type PartialTrack = Omit<Track, "album" | "artists">;

export interface DBTrack extends IncludedObject, IdentifiedObject, PartialTrack
{
  album_id: string;

  artist_ids: Set<string/*id*/>;

  genres: Set<string/*id*/>;
}
