/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {Album} from "client/model/Album";
import {Artist} from "client/model/Artist";
import {Genre} from "client/model/Genre";
import {areIdentifiedObjectsSame, IdentifiedObject} from "client/model/IdentifiedObject";
import {Title} from "client/model/Title";
import {Track} from "client/model/Track";
import {ArrayUtils} from "client/utils/ArrayUtils";
import {Explicitness, TrackStorageOrigin} from "client/utils/Types";

export class DataStore implements IdentifiedObject
{
  private _id: string;

  private _tracks: Track[] = [];

  private _albums: Album[] = [];

  private _artists: Artist[] = [];

  private _genres: Genre[] = [];

  private _titles: Title[] = [];

  private _explicits: Explicitness[] = [];

  private _lengths: number[] = []; // second

  private _popularities: number[] = []; // integer 0 - 100

  private _locals: TrackStorageOrigin[] = [];

  constructor()
  {
  }

  public get id(): string
  {
    return this._id;
  }

  public addTrack(track: Track): void
  {
    this.addToStore(track,
                    track.album,
                    track.artists,
                    track.genres,
                    track.explicit,
                    track.length,
                    track.popularity,
                    track.local
    );
  }

  private addToStore(track: Track,
                     album: Album,
                     artists: Artist[],
                     genres: Genre[],
                     explicit: Explicitness,
                     length: number,
                     popularity: number,
                     local: TrackStorageOrigin): void
  {
    ArrayUtils.pushIfMissing(this._tracks, track, areIdentifiedObjectsSame);
    ArrayUtils.pushIfMissing(this._albums, album, areIdentifiedObjectsSame);
    ArrayUtils.pushIfMissing(this._explicits, explicit);
    ArrayUtils.pushIfMissing(this._lengths, length);
    ArrayUtils.pushIfMissing(this._popularities, popularity);
    ArrayUtils.pushIfMissing(this._locals, local);

    artists.forEach((artist: Artist) => {
      ArrayUtils.pushIfMissing(this._artists, artist, areIdentifiedObjectsSame);
    });

    genres.forEach((genre: Genre) => {
      ArrayUtils.pushIfMissing(this._genres, genre, areIdentifiedObjectsSame);
    });

    const titleIndex: number = this._titles.findIndex((title: Title) => {
      title.name === track.name;
    })

    let title: Title;
    if (titleIndex === -1)
    {
      title = new Title(track.name,
                        [track.album],
                        track.genres,
                        track.artists,
                        [track.explicit],
                        [track.length],
                        [track.popularity],
                        [track.local],
                        [track]);
      this._titles.push(title);
    }
    else
    {
      title = this._titles[titleIndex];
      title.addTrack(track);
    }
  }
}
