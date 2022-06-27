/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {DBAlbum} from "app/client/db/DBAlbum";
import {DBArtist} from "app/client/db/DBArtist";
import {DBGenre} from "app/client/db/DBGenre";
import {DBPlaylist} from "app/client/db/DBPlaylist";
import {DBTrack} from "app/client/db/DBTrack";
import {ITitle} from "app/client/model/Title";
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

  public readonly albums!: Table<DBAlbum>;

  public readonly artists!: Table<DBArtist>;

  public readonly genres!: Table<DBGenre>;

  public readonly titles!: Table<ITitle>;

  public readonly tracks!: Table<DBTrack>;

  public readonly playlists!: Table<DBPlaylist>;

  constructor()
  {
    super("mittrock-spotify");

    this.version(11).stores({
                              albums: "id, name, type",
                              artists: "id",
                              genres: "id++",
                              // titles: "id, name",
                              tracks: "id, name",
                              playlists: "id, name",
                            });
  }
}
