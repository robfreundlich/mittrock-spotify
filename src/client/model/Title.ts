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
  public readonly id: string;

  public readonly type: string = "title";

  public readonly name: string;

  public readonly albums: IAlbum[];

  public readonly playlists: IPlaylist[];

  public readonly genres: IGenre[];

  public readonly artists: IArtist[];

  public readonly explicits: Explicitness[];

  public readonly lengths: number[]; // second

  public readonly popularities: number[]; // integer 0 - 100

  public readonly locals: TrackStorageOrigin[];

  public readonly tracks: ITrack[];

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
    this.id = id;
    this.name = name;
    this.albums = albums;
    this.playlists = playlists;
    this.genres = genres;
    this.artists = artists;
    this.explicits = explicits;
    this.lengths = lengths;
    this.popularities = popularities;
    this.locals = locals;
    this.tracks = tracks;
  }

  public addTrack(track: ITrack): void
  {
    if (ArrayUtils.pushIfMissing(this.tracks, track, areIdentifiedObjectsSame))
    {
      if (track.album)
      {
        ArrayUtils.pushIfMissing(this.albums, track.album, areIdentifiedObjectsSame);
      }
      ArrayUtils.pushAllMissing(this.genres, track.genres, areGenresSame);
      ArrayUtils.pushAllMissing(this.artists, track.artists, areIdentifiedObjectsSame);
      ArrayUtils.pushIfMissing(this.explicits, track.explicit);
      ArrayUtils.pushIfMissing(this.lengths, track.length);
      ArrayUtils.pushIfMissing(this.popularities, track.popularity);
      ArrayUtils.pushIfMissing(this.locals, track.local);
    }
  }
}
