/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IAlbum} from "app/client/model/Album";
import {IArtist} from "app/client/model/Artist";
import {IGenre} from "app/client/model/Genre";
import {IdentifiedObject} from "app/client/model/IdentifiedObject";
import {TrackSource} from "app/client/model/TrackSource";
import {
  areInclusionReasonsSame,
  Explicitness,
  INCLUSION_REASON_FAVORITE,
  InclusionReason,
  InclusionReasonObject,
  TrackStorageOrigin
} from "app/client/utils/Types";
import {SpotifyImage} from "spotify-web-api-ts/types/types/SpotifyObjects";
import {IncludedObject} from "app/client/model/IncludedObject";
import {ArrayUtils} from "app/client/utils/ArrayUtils";
import {IPlaylist} from "app/client/model/Playlist";
import {AppServices} from "app/client/app/AppServices";

export interface ITrack extends IdentifiedObject, IncludedObject
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

  genres: IGenre[];

  artists: IArtist[];

  addedAt: Date;

  images: SpotifyImage[];
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
  public readonly inclusionReasons: InclusionReason[];

  public addedAt: Date;
  private _album: IAlbum | undefined;

  private _playlists: IPlaylist[];

  constructor(id: string,
              name: string,
              explicit: Explicitness,
              length: number,
              popularity: number,
              local: TrackStorageOrigin,
              discNumber: number,
              trackNumber: number,
              inclusionReasons: InclusionReason[],
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

    this.inclusionReasons = inclusionReasons;
    if (album)
    {
      this._album = album;
    }
    if (addedAt)
    {
      this.addedAt = addedAt;
    }

    this.genres = genres.slice();
    this.artists = artists.slice();

    this._playlists = [];
    this.inclusionReasons
      .filter((reason) => (reason !== INCLUSION_REASON_FAVORITE) && reason.type === "playlist")
      .forEach((reason) => {
        const playlist_id: string = (reason as InclusionReasonObject).id;
        const playlist: IPlaylist | undefined = AppServices.dataStore.getPlaylist(playlist_id);
        if (playlist)
        {
          this._playlists.push(playlist);
        }
      });
  }

  public get playlists(): IPlaylist[]
  {
    return this._playlists.slice();
  }

  public addIncludedReason(reason: InclusionReason): void
  {
    ArrayUtils.pushIfMissing(this.inclusionReasons, reason, areInclusionReasonsSame);
  }

  get album(): IAlbum | undefined
  {
    return this._album;
  }

  public get images(): SpotifyImage[]
  {
    if (this._album)
    {
      return this._album.images;
    }

    // if (this._playlists)
    // {
    //   return this._playlists.find((p) => p.images.length > 0)?.images ?? [];
    // }

    return [];
  }
}
