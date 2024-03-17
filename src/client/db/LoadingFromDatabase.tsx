/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {UIRouterReact} from "@uirouter/react";
import {AppServices} from "app/client/app/AppServices";
import {browserState, loadingDatabaseState} from "app/client/app/states";
import {DataStore} from "app/client/model/DataStore";
import React from "react";
import {DBTrack} from "app/client/db/DBTrack";
import {ITrack, Track} from "app/client/model/Track";
import {ModelUtils} from "app/client/utils/ModelUtils";
import {DBAlbum} from "app/client/db/DBAlbum";
import {Album} from "app/client/model/Album";
import {Playlist} from "app/client/model/Playlist";
import {DBPlaylist} from "app/client/db/DBPlaylist";
import {DBGenre} from "app/client/db/DBGenre";
import {Genre} from "app/client/model/Genre";

export interface LoadingFromDatabaseProps
{
  authToken: string | undefined;

  dataStore: DataStore;

  router: UIRouterReact;
}

export interface LoadingState
{
  status: "uninitialized" | "no_data" | "loading" | "loaded";
  track?: Track | undefined;
  album?: Album | undefined;
  playlist?: Playlist | undefined;
}

export class LoadingFromDatabase extends React.Component<LoadingFromDatabaseProps, LoadingState>
{
  constructor(props: Readonly<LoadingFromDatabaseProps> | LoadingFromDatabaseProps)
  {
    super(props);

    this.state = {status: "uninitialized"};
  }

  public override render(): React.ReactNode
  {
    switch (this.state.status)
    {
      case "uninitialized":
        return <div>"Figuring out what to do ..."</div>;

      case "no_data":
        return <div>Going to data loader page ...</div>;

      case "loading":
        return <div>Loading
          {this.state.track && ` Track ${this.state.track.name}`}
          {this.state.album && ` Album ${this.state.album.name}`}
          {this.state.playlist && ` Playlist ${this.state.playlist.name}`}
          ...</div>;

      case "loaded":
        return <div>Going to the browser...</div>;
    }
  }

  public override async componentDidMount(): Promise<void>
  {
    const numTracks = await AppServices.db.tracks?.count();

    if (numTracks === 0)
    {
      this.setState({status: "no_data"});
    }
    else if (this.state.status !== "loading")
    {
      this.setState({status: "loading"});

      const trackPromises: Promise<Track>[] = [];
      const albumPromises: Promise<void>[] = [];
      const playlistPromises: Promise<void>[] = [];

      const makeGenre = (dbGenre: DBGenre): Genre => {
        return ModelUtils.makeGenre(AppServices.db, this.props.dataStore, dbGenre);
      };

      const makePlaylist = (dbPlaylist: DBPlaylist): Playlist => {
        return ModelUtils.makePlaylist(this.props.dataStore, dbPlaylist);
      };

      const makeTrack = (dbTrack: DBTrack): Promise<Track> => {
        return ModelUtils.makeTrack(AppServices.db, this.props.dataStore, dbTrack)
          .then((track) => {
            this.setState({status: "loading", track: track});
            this.props.dataStore.addTrack(track)
            return Promise.resolve(track);
          });
      };

      const addAlbumTracks = (dbAlbum: DBAlbum): Promise<void> => {
        const album: Album | undefined = this.props.dataStore.getAlbum(dbAlbum.id) as (Album | undefined);

        if (album)
        {
          this.setState({status: "loading", album: album, track: undefined});
          dbAlbum.track_ids.forEach((track_id) => {
            const track: ITrack | undefined = this.props.dataStore.getTrack(track_id);

            if (track)
            {
              album.addTrack(track);
            }
          });
        }

        return Promise.resolve();
      };

      const addPlaylistTracks = (dbPlaylist: DBPlaylist): Promise<void> => {
        const playlist: Playlist = this.props.dataStore.getPlaylist(dbPlaylist.id)! as Playlist;

        this.setState({status: "loading", playlist: playlist, album: undefined, track: undefined});
        dbPlaylist.track_ids.forEach((track_id) => {
          const track: ITrack | undefined = this.props.dataStore.getTrack(track_id);

          if (track)
          {
            playlist.addTrack(track);
          }
        });

        return Promise.resolve();
      };
      
      await AppServices.db.transaction("r",
                                       "tracks", "artists", "albums", "playlists", "genres",
                                       async (/*trans: Transaction*/) => {

                                         // Make genres. Note that this is not a Promise, because
                                         // it doesn't need to do anything async for each genre
                                         await AppServices.db.genres.each(async (genre: DBGenre) => {
                                           makeGenre(genre);
                                         });

                                         await AppServices.db.playlists.each(async (playlist: DBPlaylist) => {
                                           makePlaylist(playlist);
                                         });

                                         // let i: number = 0;
                                         await AppServices.db.tracks.each(async (track: DBTrack) => {
                                           // if (i > 100)
                                           // {
                                           //   return;
                                           // }
                                           trackPromises.push(makeTrack(track));
                                           // i++;
                                         });

                                         await AppServices.db.albums.each((album: DBAlbum) => {
                                           albumPromises.push(addAlbumTracks(album));
                                         });

                                         await AppServices.db.playlists.each((playlist: DBPlaylist) => {
                                           playlistPromises.push(addPlaylistTracks(playlist));
                                         });
                                         
                                         await Promise.all([...trackPromises, ... albumPromises, ... playlistPromises]);
                                       });

      this.setState({status: "loaded"});
    }
  }


  public override componentDidUpdate(prevProps: Readonly<LoadingFromDatabaseProps>, prevState: Readonly<LoadingState>, snapshot ?: any)
  {
    if (this.state.status === "no_data")
    {
      this.props.router.stateService.go(loadingDatabaseState.name,
                                        {},
                                        {
                                          location: true,
                                          inherit: true
                                        });
    }
    else if (this.state.status === "loaded")
    {
      this.props.router.stateService.go(browserState.name,
                                        {},
                                        {
                                          location: true,
                                          inherit: true
                                        });
    }
  }
}