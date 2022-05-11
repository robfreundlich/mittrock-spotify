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

  discNumber: number;

  trackNumber: number;

  album: IAlbum | undefined;

  playlist: IPlaylist | undefined;

  source: TrackSource;

  genres: IGenre[];

  artists: IArtist[];
}

/**
 * A Track represents a single instance of a song (or whatever)
 */
export class Track implements ITrack
{
  public id: string;

  public readonly name: string;

  public readonly explicit: Explicitness;

  public readonly length: number; // seconds

  public popularity: number; // integer 0 - 100

  public readonly local: TrackStorageOrigin;

  public readonly discNumber: number;

  public readonly trackNumber: number;

  public readonly album: IAlbum | undefined;

  public playlist: IPlaylist | undefined;

  public readonly genres: IGenre[];

  public readonly artists: IArtist[];

  public source: TrackSource;

  constructor(id: string,
              name: string,
              explicit: Explicitness,
              length: number,
              popularity: number,
              local: TrackStorageOrigin,
              discNumber: number,
              trackNumber: number,
              source: IAlbum | IPlaylist | IFavorites,
              genres: IGenre[],
              artists: IArtist[],
              album?: IAlbum)
  {
    this.id = id;
    this.name = name;
    this.explicit = explicit;
    this.length = length;
    this.popularity = popularity;
    this.local = local;
    this.discNumber = discNumber;
    this.trackNumber = trackNumber;

    if (isAlbum(source))
    {
      this.album = source;
      this.source = "album";
    }
    else if (isPlaylist(source))
    {
      this.playlist = source;
      this.source = "playlist";
      if (album)
      {
        this.album = album;
      }
    }
    else
    {
      this.source = "favorite";
      if (album)
      {
        this.album = album;
      }
    }

    this.genres = genres.slice();
    this.artists = artists.slice();
  }
}
