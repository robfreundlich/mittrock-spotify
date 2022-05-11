/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {DexieDB} from "app/client/db/DexieDB";
import {IAlbum} from "app/client/model/Album";
import {IArtist} from "app/client/model/Artist";
import {DataStore} from "app/client/model/DataStore";
import {IGenre} from "app/client/model/Genre";
import {IPlaylist} from "app/client/model/Playlist";
import {ITitle} from "app/client/model/Title";
import {ITrack} from "app/client/model/Track";
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
    await DexieDB.db.transaction("rw",
                                 DexieDB.db.albums,
                                 DexieDB.db.artists,
                                 DexieDB.db.genres,
                                 DexieDB.db.titles,
                                 DexieDB.db.tracks,
                                 async () => {
                                   DexieDB.db.albums.clear();
                                   DexieDB.db.artists.clear();
                                   DexieDB.db.genres.clear();
                                   DexieDB.db.titles.clear();
                                   DexieDB.db.tracks.clear();
                                 });
    await DexieDB.db.transaction("rw",
                                 DexieDB.db.playlists,
                                 async () => {
                                   DexieDB.db.playlists.clear();
                                 });

  }

  private loadAlbums(): Promise<void[]>
  {
    return Promise.all(this._dataStore.albums.map((album: IAlbum) => DexieDB.db
                                                                            .transaction("rw",
                                                                                         DexieDB.db.albums,
                                                                                         async () => {
                                                                                           DexieDB.db.albums.add(album);
                                                                                         }).catch(Dexie.DataError, (error) => {
          this._loadFailures.push({
                                    valueType: "album",
                                    value: album,
                                    failure: error.message
                                  });
        })));
  }

  private loadArtists(): Promise<void[]>
  {
    return Promise.all(this._dataStore.artists.map((artist: IArtist) => DexieDB.db
                                                                               .transaction("rw",
                                                                                            DexieDB.db.artists,
                                                                                            async () => {
                                                                                              DexieDB.db.artists.add(artist);
                                                                                            }).catch(Dexie.DataError, (error) => {
          this._loadFailures.push({
                                    valueType: "artist",
                                    value: artist,
                                    failure: error.message
                                  });
        })));
  }

  private loadGenres(): Promise<void[]>
  {
    return Promise.all(this._dataStore.genres.map((genre: IGenre) => DexieDB.db
                                                                            .transaction("rw",
                                                                                         DexieDB.db.genres,
                                                                                         async () => {
                                                                                           DexieDB.db.genres.add({
                                                                                                                   name: genre.name
                                                                                                                 });
                                                                                         }).catch(Dexie.DataError, (error) => {
          this._loadFailures.push({
                                    valueType: "genre",
                                    value: genre,
                                    failure: error.message
                                  });
        })));
  }

  private async loadTitles(): Promise<void>
  {
    return DexieDB.db.transaction("rw",
                                  DexieDB.db.titles,
                                  async () => {
                                    DexieDB.db.titles.bulkAdd(this._dataStore.titles.map((title: ITitle) => ({
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

    // return Promise.all(this._dataStore.titles.map((title: ITitle) => DexieDB.db
    //                                                                         .transaction("rw",
    //                                                                                      DexieDB.db.titles,
    //                                                                                      async () => {
    //                                                                                        DexieDB.db.titles.add(title);
    //                                                                                      }).catch(Dexie.DataError, (error) => {
    //       this._loadFailures.push({
    //                                 valueType: "title",
    //                                 value: title,
    //                                 failure: error.message
    //                               });
    //     })));
  }

  private async loadTracks(): Promise<void>
  {
    return DexieDB.db.transaction("rw",
                                  DexieDB.db.tracks,
                                  async () => {
                                    DexieDB.db.tracks.bulkAdd(this._dataStore.tracks.map((track: ITrack) => ({
                                      id: track.id,
                                      artists: track.artists,
                                      genres: track.genres,
                                      name: track.name,
                                      album: track.album,
                                      discNumber: track.discNumber,
                                      explicit: track.explicit,
                                      length: track.length,
                                      local: track.local,
                                      playlist: track.playlist,
                                      popularity: 0,
                                      source: track.source,
                                      trackNumber: 0
                                    })));
                                  });


    // return Promise.all(this._dataStore.tracks.map((track: ITrack) => DexieDB.db
    //                                                                         .transaction("rw",
    //                                                                                      DexieDB.db.tracks,
    //                                                                                      async () => {
    //                                                                                        DexieDB.db.tracks.add(track);
    //                                                                                      }).catch(Dexie.DataError, (error) => {
    //       this._loadFailures.push({
    //                                 valueType: "track",
    //                                 value: track,
    //                                 failure: error.message
    //                               });
    //     })));
  }

  private async loadPlaylists(): Promise<void[]>
  {
    return Promise.all(this._dataStore.playlists.map((playlist: IPlaylist) => DexieDB.db
                                                                                     .transaction("rw",
                                                                                                  DexieDB.db.playlists,
                                                                                                  async () => {
                                                                                                    DexieDB.db.playlists.add(playlist);
                                                                                                  }).catch(Dexie.DataError, (error) => {
          this._loadFailures.push({
                                    valueType: "playlist",
                                    value: playlist,
                                    failure: error.message
                                  });
        })));
  }
}
