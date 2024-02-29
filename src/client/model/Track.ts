/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IAlbum} from "app/client/model/Album";
import {IArtist} from "app/client/model/Artist";
import {IFavorites} from "app/client/model/Favorites";
import {IGenre} from "app/client/model/Genre";
import {IdentifiedObject} from "app/client/model/IdentifiedObject";
import {IPlaylist} from "app/client/model/Playlist";
import {isAlbum, isPlaylist, TrackSource} from "app/client/model/TrackSource";
import {Explicitness, TrackStorageOrigin} from "app/client/utils/Types";

export interface ITrack extends IdentifiedObject
{
  id: string;

  name: string;

  explicit: "explicit" | "clean";

  length: number;

  popularity: number;

  local: "local" | "streaming";

  disc_number: number;

  track_number: number;

  album: IAlbum | undefined;

  playlists: IPlaylist[];

  sources: TrackSource[];

  genres: IGenre[];

  artists: IArtist[];

  addedAt: Date;
}

/**
 * A Track represents a single instance of a song (or whatever)
 */
export class Track implements ITrack
{
  public id: string;
  public readonly type: string = "track";
  public readonly name: string;
  public readonly explicit: Explicitness;
  public readonly length: number; // seconds
  public popularity: number; // integer 0 - 100
  public readonly local: TrackStorageOrigin;
  public readonly disc_number: number;
  public readonly track_number: number;
  public readonly genres: IGenre[];
  public readonly artists: IArtist[];
  public readonly sources: TrackSource[] = [];
  public addedAt: Date;
  private _album: IAlbum | undefined;
  private _playlists: IPlaylist[] = [];

  constructor(id: string,
              name: string,
              explicit: Explicitness,
              length: number,
              popularity: number,
              local: TrackStorageOrigin,
              discNumber: number,
              trackNumber: number,
              sources: (IAlbum | IPlaylist | IFavorites)[],
              genres: IGenre[],
              artists: IArtist[],
              album?: IAlbum,
              addedAt?: Date)
  {
    this.id = id;
    this.name = name;
    this.explicit = explicit;
    this.length = length;
    this.popularity = popularity;
    this.local = local;
    this.disc_number = discNumber;
    this.track_number = trackNumber;

    this.sources = sources;
    sources.forEach((source) => {
      if (isAlbum(source))
      {
        this._album = source;
      }
      else if (isPlaylist(source))
      {
        this._playlists.push(source);
        if (album)
        {
          this._album = album;
        }
      }
      else
      {
        if (album)
        {
          this._album = album;
        }
        if (addedAt)
        {
          this.addedAt = addedAt;
        }
      }
    });

    this.genres = genres.slice();
    this.artists = artists.slice();
  }

  get album(): IAlbum | undefined
  {
    return this._album;
  }

  public get playlists(): IPlaylist[]
  {
    return this._playlists.slice();
  }
}
