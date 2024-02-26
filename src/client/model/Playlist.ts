/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {areIdentifiedObjectsSame, IdentifiedObject} from "app/client/model/IdentifiedObject";
import {ITrack} from "app/client/model/Track";
import {ITrackSource, TrackSource} from "app/client/model/TrackSource";
import {Visibility} from "app/client/utils/Types";
import {ArrayUtils} from "app/client/utils/ArrayUtils";

export interface IPlaylist extends IdentifiedObject, ITrackSource
{
  id: string;

  collaborative: boolean;

  description: string;

  name: string;

  owner: string;

  visibility: Visibility;

  snapshot_id: string;

  tracks: ITrack[];
}

export class Playlist implements IPlaylist
{
  public readonly sourceType: TrackSource = "playlist";

  public readonly type: string = "playlist";

  public collaborative: boolean;

  public description: string;

  public id: string;

  public name: string;

  public owner: string;

  public visibility: Visibility;

  public snapshot_id: string;

  public tracks: ITrack[];

  constructor(id: string,
              name: string,
              description: string,
              visibility: Visibility,
              collaborative: boolean,
              owner: string,
              snapshot_id: string,
              tracks: ITrack[])
  {
    this.collaborative = collaborative;
    this.description = description;
    this.id = id;
    this.name = name;
    this.owner = owner;
    this.visibility = visibility;
    this.snapshot_id = snapshot_id;
    this.tracks = tracks;
  }

  public addTrack(track: ITrack): void
  {
    ArrayUtils.pushIfMissing(this.tracks, track, areIdentifiedObjectsSame);
  }
}
