/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IdentifiedObject} from "app/client/model/IdentifiedObject";
import {IncludedObject} from "app/client/model/IncludedObject";
import {Album} from "spotify-web-api-ts/types/types/SpotifyObjects";

export type PartialAlbum = Omit<Album, "artists" | "tracks">;

export const makePartialAlbum = (t: Album): PartialAlbum => {
  const {artists, tracks, ...rest} = {...t};
  return rest;
};


export interface DBAlbum extends IncludedObject, IdentifiedObject, PartialAlbum
{
  artist_ids: string[];

  track_ids: string[];
}
