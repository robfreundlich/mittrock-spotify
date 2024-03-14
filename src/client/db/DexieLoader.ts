/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {AppServices} from "app/client/app/AppServices";
import {DexieStoreLoadFailure} from "app/client/db/DataStoreDexieLoader";
import {DBAlbum} from "app/client/db/DBAlbum";
import {DBArtist} from "app/client/db/DBArtist";
import {DBPlaylist} from "app/client/db/DBPlaylist";
import {DBTrack} from "app/client/db/DBTrack";
import {DBGenre} from "app/client/db/DBGenre";

export class DexieLoader
{
  public onError: (err: Error) => void;

  public onProgress?: (progress: string) => void;

  private _loadFailures: DexieStoreLoadFailure[];

  private tracks: Map<string/*id*/, DBTrack> = new Map();

  private albums: Map<string/*id*/, DBAlbum> = new Map();

  private artists: Map<string/*id*/, DBArtist> = new Map();

  private playlists: Map<string/*id*/, DBPlaylist> = new Map();

  private genres: Map<string/*id*/, DBGenre> = new Map();

  constructor(tracks: Map<string, DBTrack>,
              albums: Map<string, DBAlbum>,
              playlists: Map<string, DBPlaylist>,
              artists: Map<string, DBArtist>,
              genres: Map<string, DBGenre>)
  {
    this.tracks = tracks;
    this.albums = albums;
    this.playlists = playlists;
    this.artists = artists;
    this.genres = genres;
  }

  public get loadFailures(): DexieStoreLoadFailure[]
  {
    return this._loadFailures;
  }

  public async clear(): Promise<void>
  {
    this.reportProgress("Clearing");
    await AppServices.db.transaction("rw",
                                     AppServices.db.albums,
                                     AppServices.db.artists,
                                     AppServices.db.genres,
                                     AppServices.db.tracks,
                                     AppServices.db.playlists,
                                     async () => {
                                       this.reportProgress("Clearing albums");
                                       AppServices.db.albums.clear();
                                       this.reportProgress("Clearing artists");
                                       AppServices.db.artists.clear();
                                       this.reportProgress("Clearing genres");
                                       AppServices.db.genres.clear();
                                       this.reportProgress("Clearing tracks");
                                       AppServices.db.tracks.clear();
                                       this.reportProgress("Clearing playlists");
                                       AppServices.db.playlists.clear();
                                       this.reportProgress("Done clearing");
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
    await this.loadPlaylists();
  }

  private async loadAlbums()
  {
    this.reportProgress("Loading albums");
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
    this.reportProgress("Loading tracks");
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
    this.reportProgress("Loading genres");
    return Promise.all([...this.genres.values()]
                           .map((dbGenre: DBGenre) => AppServices.db
                                                                .transaction("rw",
                                                                             AppServices.db.genres,
                                                                             async () => {
                                                                               try
                                                                               {
                                                                                 AppServices.db.genres.add(dbGenre);
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
    this.reportProgress("Loading artists");
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

  private async loadPlaylists()
  {
    this.reportProgress("Loading playlists");
    return Promise.all([...this.playlists.values()]
                           .map((dbPlaylist: DBPlaylist) => AppServices.db
                                                                       .transaction("rw",
                                                                                    AppServices.db.playlists,
                                                                                    async () => {
                                                                                      try
                                                                                      {
                                                                                        AppServices.db.playlists.add(dbPlaylist);
                                                                                      }
                                                                                      catch (error)
                                                                                      {
                                                                                        if ((<any>error).hasOwnProperty("message"))
                                                                                        {
                                                                                          error = (<any>error).message;
                                                                                        }
                                                                                        this._loadFailures.push({
                                                                                                                  valueType: "playlist",
                                                                                                                  value: dbPlaylist,
                                                                                                                  failure: <string>error
                                                                                                                });
                                                                                      }
                                                                                    })));
  }

  private reportProgress(message: string): void
  {
    console.log(message);

    if (this.onProgress)
    {
      this.onProgress(message);
    }
  }
}
