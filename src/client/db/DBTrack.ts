/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IdentifiedObject} from "app/client/model/IdentifiedObject";
import {IncludedObject} from "app/client/model/IncludedObject";
import {Track} from "spotify-web-api-ts/types/types/SpotifyObjects";
import {DBAlbum} from "app/client/db/DBAlbum";

export type PartialTrack = Omit<Track, "album" | "artists">;

export const makePartialTrack = (t: Track): PartialTrack => {
  const {album, artists, ...rest} = {...t};
  return rest;
};

export interface DBTrack extends IncludedObject, IdentifiedObject, PartialTrack
{
  album_id: string;

  artist_ids: Set<string/*id*/>;

  genre_ids: Set<string/*id*/>;

  album?: DBAlbum;
}
