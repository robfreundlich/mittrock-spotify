/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IAlbum} from "app/client/model/Album";
import {IArtist} from "app/client/model/Artist";
import {IGenre} from "app/client/model/Genre";
import {IdentifiedObject} from "app/client/model/IdentifiedObject";
import {IPlaylist} from "app/client/model/Playlist";
import {ITitle} from "app/client/model/Title";
import {ITrack} from "app/client/model/Track";
import Dexie, {Table} from "dexie";

export class DexieDB extends Dexie
{
  public static readonly CURRENT_VERSION = 11;

  private static instance: DexieDB;

  public static get db(): DexieDB
  {
    if (!DexieDB.instance)
    {
      DexieDB.instance = new DexieDB();
    }

    return DexieDB.instance;
  }

  public readonly albums!: Table<IAlbum>;

  public readonly artists!: Table<IArtist>;

  public readonly genres!: Table<IGenre | IdentifiedObject>;

  public readonly titles!: Table<ITitle>;

  public readonly tracks!: Table<ITrack>;

  public readonly playlists!: Table<IPlaylist>;

  public readonly testing!: Table<{ id: string, name: string }>;

  constructor()
  {
    super("mittrock-spotify");

    this.version(1).stores({
                             albums: "id, name, type",
                             artists: "id",
                             genres: "id++",
                             titles: "id, name",
                             tracks: "id, name",
                             playlists: "id, name",
                           });
  }
}
