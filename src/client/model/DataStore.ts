/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IAlbum} from "app/client/model/Album";
import {IArtist} from "app/client/model/Artist";
import {areGenresSame, IGenre} from "app/client/model/Genre";
import {IPlaylist} from "app/client/model/Playlist";
import {ITitle, Title} from "app/client/model/Title";
import {ITrack} from "app/client/model/Track";
import {ArrayUtils} from "app/client/utils/ArrayUtils";
import {ModelUtils} from "app/client/utils/ModelUtils";
import {Explicitness, TrackStorageOrigin} from "app/client/utils/Types";
import {areIdentifiedObjectsSame, IdentifiedObject} from "./IdentifiedObject";
import {isTrackAlbum, isTrackFavorite, isTrackPlaylist} from "app/client/model/TrackSource";


export class DataStore implements IdentifiedObject
{
  private static canonicalName(name: string): string
  {
    return name.toLowerCase().replace(/\s/g, "");
  }

  private _id: string;

  public readonly name: string = "DataStore";

  private _tracks: ITrack[] = [];

  private _albums: IAlbum[] = [];

  private _artists: IArtist[] = [];

  private _playlists: IPlaylist[] = [];

  private _genres: IGenre[] = [];

  private _titles: ITitle[] = [];

  private _explicits: Explicitness[] = [];

  private _lengths: number[] = []; // second

  private _popularities: number[] = []; // integer 0 - 100

  private _locals: TrackStorageOrigin[] = [];

  private _titlesByName: Map<string, Title> = new Map();

  constructor()
  {
  }

  public get numFavoriteTracks(): number
  {
    return this.getFavorites().length;
  }

  public get numAlbumTracks(): number
  {
    return this._tracks.filter((track) => isTrackAlbum(track)).length;
  }

  public get playlists(): IPlaylist[]
  {
    return this._playlists;
  }

  public get id(): string
  {
    return this._id;
  }

  public get tracks(): ITrack[]
  {
    return this._tracks;
  }

  public get albums(): IAlbum[]
  {
    return this._albums;
  }

  public get artists(): IArtist[]
  {
    return this._artists;
  }

  public get genres(): IGenre[]
  {
    return this._genres;
  }

  public get titles(): ITitle[]
  {
    return this._titles;
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

  public get numPlaylistTracks(): number
  {
    return this._tracks.filter((track) => isTrackPlaylist(track)).length;
  }

  public addTrack(track: ITrack): void
  {
    this.addToStore(track, track.album, track.playlists, track.artists, track.genres, track.explicit, track.length, track.popularity, track.local);
  }
  
  public getTrack(id: string): ITrack | undefined
  {
    return this._tracks.find((track) => track.id === id);
  }

  public getAlbum(id: string): IAlbum | undefined
  {
    return this._albums.find((album) => album.id === id);
  }

  public getArtist(id: string): IArtist | undefined
  {
    return this._artists.find((artist) => artist.id === id);
  }

  public getPlaylist(id: string): IPlaylist | undefined
  {
    return this._playlists.find((playlist) => playlist.id === id);
  }
  
  public clear(): void
  {
    this._tracks = [];

    this._albums = [];

    this._artists = [];

    this._playlists = [];

    this._genres = [];

    this._titles = [];

    this._explicits = [];

    this._lengths = [];

    this._popularities = [];

    this._locals = [];

    this._titlesByName = new Map();
  }

  public getFavorites(): ITrack[]
  {
    return this._tracks.filter((track) => isTrackFavorite(track));
  }

  private addToStore(track: ITrack,
                     album: IAlbum | undefined,
                     playlists: IPlaylist[],
                     artists: IArtist[],
                     genres: IGenre[],
                     explicit: Explicitness,
                     length: number,
                     popularity: number,
                     local: TrackStorageOrigin): void
  {
    ArrayUtils.pushIfMissing(this._tracks, track, areIdentifiedObjectsSame);
    if (album)
    {
      ArrayUtils.pushIfMissing(this._albums, album, areIdentifiedObjectsSame);
    }

    ArrayUtils.pushAllMissing(this._playlists, playlists, areIdentifiedObjectsSame);

    ArrayUtils.pushIfMissing(this._explicits, explicit);
    ArrayUtils.pushIfMissing(this._lengths, length);
    ArrayUtils.pushIfMissing(this._popularities, popularity);
    ArrayUtils.pushIfMissing(this._locals, local);

    artists.forEach((artist: IArtist) => {
      ArrayUtils.pushIfMissing(this._artists, artist, areIdentifiedObjectsSame);
    });

    genres.forEach((genre: IGenre) => {
      ArrayUtils.pushIfMissing(this._genres, genre, areGenresSame);
    });

    const canonicalName = DataStore.canonicalName(track.name);
    let title: Title | undefined = this._titlesByName.get(canonicalName);
    if (!title)
    {
      title = new Title(ModelUtils.generateId(),
                        track.name,
                        track.album ? [track.album] : [],
                        track.playlists,
                        track.genres,
                        track.artists,
                        [track.explicit],
                        [track.length],
                        [track.popularity],
                        [track.local],
                        [track]);
      this._titles.push(title);
      this._titlesByName.set(canonicalName, title);
    }
    else
    {
      title.addTrack(track);
    }
  }
}
