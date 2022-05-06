/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IdentifiedObject} from "app/client/model/IdentifiedObject";
import {ITrack} from "app/client/model/Track";
import {ITrackSource, TrackSource} from "app/client/model/TrackSource";
import {Visibility} from "app/client/utils/Types";

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

  private _collaborative: boolean;

  private _description: string;

  private _id: string;

  private _name: string;

  private _owner: string;

  private _visibility: Visibility;

  private _snapshot_id: string;

  private _tracks: ITrack[];

  constructor(id: string,
              name: string,
              description: string,
              visibility: Visibility,
              collaborative: boolean,
              owner: string,
              snapshot_id: string,
              tracks: ITrack[])
  {
    this._collaborative = collaborative;
    this._description = description;
    this._id = id;
    this._name = name;
    this._owner = owner;
    this._visibility = visibility;
    this._snapshot_id = snapshot_id;
    this._tracks = tracks;
  }

  public get visibility(): Visibility
  {
    return this._visibility;
  }

  public set visibility(value: Visibility)
  {
    this._visibility = value;
  }

  public get collaborative(): boolean
  {
    return this._collaborative;
  }

  public set collaborative(value: boolean)
  {
    this._collaborative = value;
  }

  public get description(): string
  {
    return this._description;
  }

  public set description(value: string)
  {
    this._description = value;
  }

  public get id(): string
  {
    return this._id;
  }

  public set id(value: string)
  {
    this._id = value;
  }

  public get name(): string
  {
    return this._name;
  }

  public set name(value: string)
  {
    this._name = value;
  }

  public get owner(): string
  {
    return this._owner;
  }

  public set owner(value: string)
  {
    this._owner = value;
  }

  public get snapshot_id(): string
  {
    return this._snapshot_id;
  }

  public set snapshot_id(value: string)
  {
    this._snapshot_id = value;
  }

  public get tracks(): ITrack[]
  {
    return this._tracks;
  }

  public set tracks(value: ITrack[])
  {
    this._tracks = value;
  }
}
