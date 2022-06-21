/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {AppServices} from "app/client/app/AppServices";
import {DexieStoreLoadFailure} from "app/client/db/DataStoreDexieLoader";
import {DBAlbum} from "app/client/db/DBAlbum";
import {DBArtist} from "app/client/db/DBArtist";
import {DBTrack} from "app/client/db/DBTrack";

export class DexieLoader
{
  public onError: (err: Error) => void;

  private _loadFailures: DexieStoreLoadFailure[];

  private tracks: Map<string/*id*/, DBTrack> = new Map();

  private albums: Map<string/*id*/, DBAlbum> = new Map();

  private artists: Map<string/*id*/, DBArtist> = new Map();

  private genres: Set<string> = new Set();

  constructor(tracks: Map<string, DBTrack>, albums: Map<string, DBAlbum>, artists: Map<string, DBArtist>, genres: Set<string>)
  {
    this.tracks = tracks;
    this.albums = albums;
    this.artists = artists;
    this.genres = genres;
  }

  public get loadFailures(): DexieStoreLoadFailure[]
  {
    return this._loadFailures;
  }

  public async clear(): Promise<void>
  {
    await AppServices.db.transaction("rw",
                                     AppServices.db.albums,
                                     AppServices.db.artists,
                                     AppServices.db.genres,
                                     AppServices.db.tracks,
                                     async () => {
                                       AppServices.db.albums.clear();
                                       AppServices.db.artists.clear();
                                       AppServices.db.genres.clear();
                                       AppServices.db.tracks.clear();
                                     });

    this._loadFailures = [];
  }

  public async load()
  {
    await this.clear();

    await this.loadAlbums();

    await this.loadArtists();
    await this.loadGenres();
    await this.loadTracks();
  }

  private async loadAlbums()
  {
    return Promise.all([...this.albums.values()]
                           .map((dbAlbum: DBAlbum) => AppServices.db
                                                                 .transaction("rw",
                                                                              AppServices.db.albums,
                                                                              async () => {
                                                                                try
                                                                                {
                                                                                  AppServices.db.albums.add(dbAlbum);
                                                                                }
                                                                                catch (error)
                                                                                {
                                                                                  if ((<any>error).hasOwnProperty("message"))
                                                                                  {
                                                                                    error = (<any>error).message;
                                                                                  }
                                                                                  this._loadFailures.push({
                                                                                                            valueType: "album",
                                                                                                            value: dbAlbum,
                                                                                                            failure: <string>error
                                                                                                          });
                                                                                }
                                                                              })));
  }

  private async loadTracks()
  {
    return Promise.all([...this.tracks.values()]
                           .map((dbTrack: DBTrack) => AppServices.db
                                                                 .transaction("rw",
                                                                              AppServices.db.tracks,
                                                                              async () => {
                                                                                try
                                                                                {
                                                                                  AppServices.db.tracks.add(dbTrack);
                                                                                }
                                                                                catch (error)
                                                                                {
                                                                                  if ((<any>error).hasOwnProperty("message"))
                                                                                  {
                                                                                    error = (<any>error).message;
                                                                                  }
                                                                                  this._loadFailures.push({
                                                                                                            valueType: "track",
                                                                                                            value: dbTrack,
                                                                                                            failure: <string>error
                                                                                                          });
                                                                                }
                                                                              })));
  }

  private async loadGenres()
  {
    return Promise.all([...this.genres.values()]
                           .map((dbGenre: string) => AppServices.db
                                                                .transaction("rw",
                                                                             AppServices.db.genres,
                                                                             async () => {
                                                                               try
                                                                               {
                                                                                 AppServices.db.genres.add({name: dbGenre});
                                                                               }
                                                                               catch (error)
                                                                               {
                                                                                 if ((<any>error).hasOwnProperty("message"))
                                                                                 {
                                                                                   error = (<any>error).message;
                                                                                 }
                                                                                 this._loadFailures.push({
                                                                                                           valueType: "genre",
                                                                                                           value: dbGenre,
                                                                                                           failure: <string>error
                                                                                                         });
                                                                               }
                                                                             })));

  }

  private async loadArtists()
  {
    return Promise.all([...this.artists.values()]
                           .map((dbArtist: DBArtist) => AppServices.db
                                                                   .transaction("rw",
                                                                                AppServices.db.artists,
                                                                                async () => {
                                                                                  try
                                                                                  {
                                                                                    AppServices.db.artists.add(dbArtist);
                                                                                  }
                                                                                  catch (error)
                                                                                  {
                                                                                    if ((<any>error).hasOwnProperty("message"))
                                                                                    {
                                                                                      error = (<any>error).message;
                                                                                    }
                                                                                    this._loadFailures.push({
                                                                                                              valueType: "artist",
                                                                                                              value: dbArtist,
                                                                                                              failure: <string>error
                                                                                                            });
                                                                                  }
                                                                                })));
  }
}