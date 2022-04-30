/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IAlbum} from "app/client/model/Album";
import {IArtist} from "app/client/model/Artist";
import {IGenre} from "app/client/model/Genre";
import {ITitle} from "app/client/model/Title";
import {ITrack} from "app/client/model/Track";
import Dexie, {Table} from "dexie";

export class DexieDB extends Dexie
{
  public static readonly CURRENT_VERSION = 1;

  private static instance: DexieDB;

  public readonly albums!: Table<IAlbum>;

  public readonly artists!: Table<IArtist>;

  public readonly genres!: Table<IGenre>;

  public readonly titles!: Table<ITitle>;

  public readonly tracks!: Table<ITrack>;

  constructor()
  {
    super("mittrock-spotify");

    this.version(DexieDB.CURRENT_VERSION).stores({
                                                   albums: "id, name, type",
                                                   artists: "id, name",
                                                   genres: "name",
                                                   titles: "id, name, *genres.name, *artists.name",
                                                   tracks: "id, name, album.name, *genres.name, artists.*name"
                                                 });
  }

  public static get db(): DexieDB
  {
    if (!DexieDB.instance)
    {
      DexieDB.instance = new DexieDB();
    }

    return DexieDB.instance;
  }
}
