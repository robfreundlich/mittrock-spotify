/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IdentifiedObject} from "app/client/model/IdentifiedObject";
import {IncludedObject} from "app/client/model/IncludedObject";
import {Album} from "spotify-web-api-ts/src/types/SpotifyObjects";

export type PartialAlbum = Omit<Album, "artists" | "images" | "tracks">;

export interface DBAlbum extends IncludedObject, IdentifiedObject, PartialAlbum
{
  artist_ids: string[];

  track_ids: string[];

  image_ids: string[];
}
