/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IdentifiedObject} from "app/client/model/IdentifiedObject";
import {IncludedObject} from "app/client/model/IncludedObject";
import {Playlist} from "spotify-web-api-ts/types/types/SpotifyObjects";

export type PartialPlaylist = Omit<Playlist, "tracks">;

export const makePartialPlaylist = (p: Playlist): PartialPlaylist => {
  const {tracks, ...rest} = {...p};
  return rest;
};

export interface DBPlaylist extends IncludedObject, IdentifiedObject, PartialPlaylist
{
  track_ids: string[];
}
