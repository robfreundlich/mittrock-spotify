/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {AppServices} from "app/client/app/AppServices";
import {IAlbum} from "app/client/model/Album";
import {IArtist} from "app/client/model/Artist";
import {DataStore} from "app/client/model/DataStore";
import {IGenre} from "app/client/model/Genre";
import {IPlaylist} from "app/client/model/Playlist";
import {ITitle} from "app/client/model/Title";
import Dexie from "dexie";

export class DexieStoreLoadFailure
{
  valueType: string;

  value: any;

  failure: string;
}

export class DataStoreDexieLoader
{
  public onError: (err: Error) => void;

  private _dataStore: DataStore;

  private _loadFailures: DexieStoreLoadFailure[];

  constructor(dataStore: DataStore)
  {
    this._dataStore = dataStore;
  }

  public get loadFailures(): DexieStoreLoadFailure[]
  {
    return this._loadFailures;
  }

  public get dataStore(): DataStore
  {
    return this._dataStore;
  }

  public async load(): Promise<void>
  {
    this._loadFailures = [];

    await this.clear();
    await this.loadAlbums();

    await this.loadArtists();
    await this.loadGenres();
    await this.loadTitles();
    await this.loadTracks();
    await this.loadPlaylists();
  }

  private async clear(): Promise<void>
  {
    await AppServices.db.transaction("rw",
                                     AppServices.db.albums,
                                     AppServices.db.artists,
                                     AppServices.db.genres,
                                     AppServices.db.titles,
                                     AppServices.db.tracks,
                                     async () => {
                                       AppServices.db.albums.clear();
                                       AppServices.db.artists.clear();
                                       AppServices.db.genres.clear();
                                       AppServices.db.titles.clear();
                                       AppServices.db.tracks.clear();
                                     });
    await AppServices.db.transaction("rw",
                                     AppServices.db.playlists,
                                     async () => {
                                       AppServices.db.playlists.clear();
                                     });

  }

  private loadAlbums(): Promise<void[]>
  {
    return Promise.all(this._dataStore.albums.map((album: IAlbum) => AppServices.db
                                                                                .transaction("rw",
                                                                                             AppServices.db.albums,
                                                                                             async () => {
                                                                                               // const dbAlbum: DBAlbum = new DBAlbum(album.id,
                                                                                               //                                      album.name,
                                                                                               //                                      album.type,
                                                                                               //                                      album.releaseDate,
                                                                                               //                                      album.releaseDatePrecision);
                                                                                               // dbAlbum.track_ids = album.tracks.map((track) => track.id);
                                                                                               // dbAlbum.artist_ids = album.artists.map((artist) =>
                                                                                               // artist.id); AppServices.db.albums.add(dbAlbum);
                                                                                             }).catch(Dexie.DexieError, (error) => {
          this._loadFailures.push({
                                    valueType: "album",
                                    value: album,
                                    failure: error.message
                                  });
        })));
  }

  private loadArtists(): Promise<void[]>
  {
    return Promise.all(this._dataStore.artists.map((artist: IArtist) => AppServices.db
                                                                                   .transaction("rw",
                                                                                                AppServices.db.artists,
                                                                                                async () => {
                                                                                                  // AppServices.db.artists.add(artist);
                                                                                                }).catch(Dexie.DexieError, (error) => {
          this._loadFailures.push({
                                    valueType: "artist",
                                    value: artist,
                                    failure: error.message
                                  });
        })));
  }

  private loadGenres(): Promise<void[]>
  {
    return Promise.all(this._dataStore.genres.map((genre: IGenre) => AppServices.db
                                                                                .transaction("rw",
                                                                                             AppServices.db.genres,
                                                                                             async () => {
                                                                                               AppServices.db.genres.add(genre);
                                                                                             }).catch(Dexie.DexieError, (error) => {
          this._loadFailures.push({
                                    valueType: "genre",
                                    value: genre,
                                    failure: error.message
                                  });
        })));
  }

  private async loadTitles(): Promise<void>
  {
    return AppServices.db.transaction("rw",
                                      AppServices.db.titles,
                                      async () => {
                                        AppServices.db.titles.bulkAdd(this._dataStore.titles.map((title: ITitle) => ({
                                          id: title.id,
                                          artists: title.artists,
                                          genres: title.genres,
                                          tracks: title.tracks,
                                          lengths: title.lengths,
                                          locals: title.locals,
                                          explicits: title.explicits,
                                          playlists: title.playlists,
                                          popularities: title.popularities,
                                          albums: title.albums,
                                          name: title.name,
                                        })));
                                      });

    // return Promise.all(this._dataStore.titles.map((title: ITitle) => AppServices.db
    //                                                                         .transaction("rw",
    //                                                                                      AppServices.db.titles,
    //                                                                                      async () => {
    //                                                                                        AppServices.db.titles.add(title);
    //                                                                                      }).catch(Dexie.DexieError, (error) => {
    //       this._loadFailures.push({
    //                                 valueType: "title",
    //                                 value: title,
    //                                 failure: error.message
    //                               });
    //     })));
  }

  private async loadTracks(): Promise<void>
  {
    return AppServices.db.transaction("rw",
                                      AppServices.db.tracks,
                                      async () => {
                                        // AppServices.db.tracks.bulkAdd(this._dataStore.tracks.map((track: ITrack) => ({
                                        //   id: track.id,
                                        //   artists: track.artists,
                                        //   genres: track.genres,
                                        //   name: track.name,
                                        //   album: track.album,
                                        //   discNumber: track.discNumber,
                                        //   explicit: track.explicit,
                                        //   length: track.length,
                                        //   local: track.local,
                                        //   playlist: track.playlist,
                                        //   popularity: 0,
                                        //   source: track.source,
                                        //   trackNumber: 0,
                                        //   addedAt: track.addedAt
                                        // })));
                                      });


    // return Promise.all(this._dataStore.tracks.map((track: ITrack) => AppServices.db
    //                                                                         .transaction("rw",
    //                                                                                      AppServices.db.tracks,
    //                                                                                      async () => {
    //                                                                                        AppServices.db.tracks.add(track);
    //                                                                                      }).catch(Dexie.DexieError, (error) => {
    //       this._loadFailures.push({
    //                                 valueType: "track",
    //                                 value: track,
    //                                 failure: error.message
    //                               });
    //     })));
  }

  private async loadPlaylists(): Promise<void[]>
  {
    return Promise.all(this._dataStore.playlists.map((playlist: IPlaylist) => AppServices.db
                                                                                         .transaction("rw",
                                                                                                      AppServices.db.playlists,
                                                                                                      async () => {
                                                                                                        // AppServices.db.playlists.add(playlist);
                                                                                                      }).catch(Dexie.DexieError, (error) => {
          this._loadFailures.push({
                                    valueType: "playlist",
                                    value: playlist,
                                    failure: error.message
                                  });
        })));
  }
}
