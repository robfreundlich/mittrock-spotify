/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IdentifiedObject} from "app/client/model/IdentifiedObject";
import {IncludedObject} from "app/client/model/IncludedObject";
import {Artist} from "spotify-web-api-ts/types/types/SpotifyObjects";

export type PartialArtist = Omit<Artist, "images">
{
}

export interface DBArtist extends IncludedObject, IdentifiedObject, PartialArtist
{
  image_ids: string[];
}
