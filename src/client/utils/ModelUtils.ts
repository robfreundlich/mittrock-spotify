/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {Track} from "app/client/model/Track";
import {DBTrack} from "app/client/db/DBTrack";
import {DexieDB} from "app/client/db/DexieDB";
import {DBAlbum} from "app/client/db/DBAlbum";
import {Album, IAlbum} from "app/client/model/Album";
import {Artist, IArtist} from "app/client/model/Artist";
import {DBArtist} from "app/client/db/DBArtist";
import {INCLUSION_REASON_FAVORITE, InclusionReason} from "app/client/utils/Types";
import {Favorites, IFavorites} from "app/client/model/Favorites";
import {IPlaylist, Playlist} from "app/client/model/Playlist";
import {DBPlaylist} from "app/client/db/DBPlaylist";
import {DataStore} from "app/client/model/DataStore";
import {TrackSource} from "app/client/model/TrackSource";
import {SpotifyImage} from "spotify-web-api-ts/types/types/SpotifyObjects";
import {DBGenre} from "app/client/db/DBGenre";
import {Genre} from "app/client/model/Genre";

export class ModelUtils {
  private static readonly BASE62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  public static generateId(): string {
    return ModelUtils.generateRandomString(22);
  }

  public static generateRandomString(length: number): string {
    let s: string = "";
    for (let i = 0; i < length; i++)
    {
      s = s + ModelUtils.BASE62.charAt(Math.floor(Math.random() * ModelUtils.BASE62.length));
    }

    return s;
  }

  public static async makeTrack(db: DexieDB, dataStore: DataStore, dbTrack: DBTrack): Promise<Track> {
    let album: Album | undefined;
    if (dbTrack.album)
    {
      album = await ModelUtils.makeAlbumFromDBAlbum(db, dataStore, dbTrack.album);
    }
    else
    {
      album = await ModelUtils.makeAlbum(db, dataStore, dbTrack.album_id);
    }

    const artists: Artist[] = await ModelUtils.makeArtists(db, dataStore, dbTrack.artist_ids);

    const sources: TrackSource[] = await Promise.all(dbTrack.inclusionReasons.map(async (reason: InclusionReason) => {
      let playlist: Playlist | undefined;

      let source: IAlbum | IPlaylist | IFavorites;
      if (reason === INCLUSION_REASON_FAVORITE)
      {
        source = Favorites.favorites;
      }
      else
      {
        if ((reason.type === "favorite_album") || (reason.type === "playlist_track_album"))
        {
          source = album!;
        }
        else
        {
          playlist = await ModelUtils.makePlaylist(db, dataStore, reason.id);
          source = playlist!;
        }
      }

      return source;
    }));

    const genres = dbTrack.genre_ids
    ? [...dbTrack.genre_ids].map((id: string) => dataStore.genres.find((genre) => genre.id === id)!)
      : [];

    const track: Track = new Track(
      dbTrack.id,
      dbTrack.name,
      dbTrack.explicit ? "explicit" : "clean",
      dbTrack.duration_ms,
      dbTrack.popularity,
      "streaming",
      dbTrack.disc_number,
      dbTrack.track_number,
      sources,
      genres,
      artists,
      album,
      new Date());

    // if (album)
    // {
    //   album.addTrack(track);
    // }
    //
    // track.playlists.forEach((playlist) => {
    //   playlist.addTrack(track);
    // });

    return track;
  }

  public static async makeAlbumFromDBAlbum(db: DexieDB, dataStore: DataStore, dbAlbum: DBAlbum): Promise<Album>
  {
    const existingAlbum: IAlbum | undefined = dataStore.getAlbum(dbAlbum.id);

    if (existingAlbum)
    {
      return existingAlbum as Album;
    }

    const artists: Artist[] = await ModelUtils.makeArtists(db, dataStore, dbAlbum.artist_ids);

    const album: Album = new Album(
      dbAlbum.id,
      dbAlbum.name,
      dbAlbum.type,
      dbAlbum.release_date,
      dbAlbum.release_date_precision,
      artists,
      dbAlbum.images,
      new Date()
    );

    return album;
  }

  public static async makeAlbum(db: DexieDB, dataStore: DataStore, album_id?: string): Promise<Album | undefined> {
    if (!album_id)
    {
      return undefined;
    }

    const existingAlbum: IAlbum | undefined = dataStore.getAlbum(album_id);

    if (album_id === '4kdOH3s9cRL9YykvHFpSlD')
    {
      console.log("***** existing album: ", existingAlbum);
    }


    if (existingAlbum)
    {
      return existingAlbum as Album;
    }
    
    const dbAlbum: DBAlbum | undefined = await db.albums.get(album_id);

    if (album_id === '4kdOH3s9cRL9YykvHFpSlD')
    {
      console.log("***** db album: ", dbAlbum);
    }

    if (!dbAlbum)
    {
      return undefined;
    }

    const artists: Artist[] = await ModelUtils.makeArtists(db, dataStore, dbAlbum.artist_ids);

    const album: Album = new Album(
      dbAlbum.id,
      dbAlbum.name,
      dbAlbum.type,
      dbAlbum.release_date,
      dbAlbum.release_date_precision,
      artists,
      dbAlbum.images,
      new Date()
    );

    return album;
  }

  public static async makeArtists(db: DexieDB, dataStore: DataStore, artist_ids?: Set<string> | Array<string>): Promise<Artist[]> {
    if (!artist_ids)
    {
      return [];
    }

    return Promise.all([...artist_ids].map(async (artist_id): Promise<Artist | undefined> => {
      const existingArtist: IArtist | undefined = dataStore.getArtist(artist_id);

      if (existingArtist)
      {
        return existingArtist as Artist;
      }
      
      const dbArtist: DBArtist | undefined = await db.artists.get(artist_id);

      if (!dbArtist)
      {
        return undefined;
      }

      const artist: Artist = new Artist(
        dbArtist.id,
        dbArtist.name,
        dbArtist.popularity,
        [...dbArtist.genres].map((name: string) => dataStore.genres.find((genre) => genre.name === name)!),
        dbArtist.images
      );

      return artist;
    }))
      .then((artists: (Artist | undefined)[]) => {
        return artists.filter((artist: Artist | undefined) => {
          return artist !== undefined;
        })
      }) as unknown as Artist[];
  }

  private static async makePlaylist(db: DexieDB, dataStore: DataStore, id: string): Promise<Playlist | undefined> {
    const existingPlaylist: IPlaylist | undefined = dataStore.getPlaylist(id);

    if (existingPlaylist)
    {
      return existingPlaylist as Playlist;
    }

    const dbPlaylist: DBPlaylist | undefined = await db.playlists.get(id);

    if (!dbPlaylist)
    {
      return undefined;
    }

    return new Playlist(
      dbPlaylist.id,
      dbPlaylist.name,
      dbPlaylist.description ?? "",
      dbPlaylist.public ? "public" : "private",
      dbPlaylist.collaborative,
      dbPlaylist.owner.display_name ?? "",
      dbPlaylist.snapshot_id,
      dbPlaylist.images,
      []);
  }

  public static getImageNearSize(images: SpotifyImage[], size: number): SpotifyImage | undefined
  {
    if (!images)
    {
      return undefined;
    }

    let result: SpotifyImage | undefined = undefined;
    let distance:  number = Infinity;

    images.forEach((image) => {
      if (image.width && (Math.abs(image.width - size) < distance))
      {
        distance = Math.abs(image.width - size);
        result = image;
      }
    });

    return result;
  }

  public static makeGenre(db: DexieDB, dataStore: DataStore, dbGenre: DBGenre): Genre
  {
    const genre: Genre = new Genre(dbGenre.name, dbGenre.inclusionReasons);
    dataStore.genres.push(genre);
    return genre;
  }
}
