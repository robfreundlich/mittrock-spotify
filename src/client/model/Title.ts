/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IArtist} from "app/client/model/Artist";
import {areGenresSame, IGenre} from "app/client/model/Genre";
import {areIdentifiedObjectsSame, IdentifiedObject} from "app/client/model/IdentifiedObject";
import {IPlaylist} from "app/client/model/Playlist";
import {ITrack} from "app/client/model/Track";
import {ArrayUtils} from "app/client/utils/ArrayUtils";
import {Explicitness, TrackStorageOrigin} from "app/client/utils/Types";
import {IAlbum} from "./Album";

export interface ITitle extends IdentifiedObject
{
  id: string;

  name: string;

  albums: IAlbum[];

  playlists: IPlaylist[];

  genres: IGenre[];

  artists: IArtist[];

  explicits: Explicitness[];

  lengths: number[];

  popularities: number[];

  locals: TrackStorageOrigin[];

  tracks: ITrack[];
}

/**
 * A title represents all <code>{@link ITrack}</code>s that have the same name.
 */
export class Title implements ITitle
{
  private _id: string;

  private _name: string;

  private _albums: IAlbum[];

  private _playlists: IPlaylist[];

  private _genres: IGenre[];

  private _artists: IArtist[];

  private _explicits: Explicitness[];

  private _lengths: number[]; // second

  private _popularities: number[]; // integer 0 - 100

  private _locals: TrackStorageOrigin[];

  private _tracks: ITrack[];

  constructor(id: string,
              name: string,
              albums: IAlbum[],
              playlists: IPlaylist[],
              genres: IGenre[],
              artists: IArtist[],
              explicits: Explicitness[],
              lengths: number[],
              popularities: number[],
              locals: TrackStorageOrigin[],
              tracks: ITrack[])
  {
    this._id = id;
    this._name = name;
    this._albums = albums;
    this._playlists = playlists;
    this._genres = genres;
    this._artists = artists;
    this._explicits = explicits;
    this._lengths = lengths;
    this._popularities = popularities;
    this._locals = locals;
    this._tracks = tracks;
  }

  public get playlists(): IPlaylist[]
  {
    return this._playlists;
  }

  public get id(): string
  {
    return this._id;
  }

  public get name(): string
  {
    return this._name;
  }

  public get albums(): IAlbum[]
  {
    return this._albums;
  }

  public get genres(): IGenre[]
  {
    return this._genres;
  }

  public get artists(): IArtist[]
  {
    return this._artists;
  }

  public get explicits(): Explicitness[]
  {
    return this._explicits;
  }

  public get lengths(): number[]
  {
    return this._lengths;
  }

  public get popularities(): number[]
  {
    return this._popularities;
  }

  public get locals(): TrackStorageOrigin[]
  {
    return this._locals;
  }

  public get tracks(): ITrack[]
  {
    return this._tracks;
  }

  public addTrack(track: ITrack): void
  {
    if (ArrayUtils.pushIfMissing(this._tracks, track, areIdentifiedObjectsSame))
    {
      if (track.album)
      {
        ArrayUtils.pushIfMissing(this._albums, track.album, areIdentifiedObjectsSame);
      }
      ArrayUtils.pushAllMissing(this._genres, track.genres, areGenresSame);
      ArrayUtils.pushAllMissing(this._artists, track.artists, areIdentifiedObjectsSame);
      ArrayUtils.pushIfMissing(this._explicits, track.explicit);
      ArrayUtils.pushIfMissing(this._lengths, track.length);
      ArrayUtils.pushIfMissing(this._popularities, track.popularity);
      ArrayUtils.pushIfMissing(this._locals, track.local);
    }
  }
}
