/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {ClientInfo} from "app/client/app/ClientInfo";
import {DataStore} from "app/client/model/DataStore";
import {TrackLoader} from "app/client/model/TrackLoader";
import {TrackLoaderController} from "app/client/model/TrackLoaderController";
import * as React from "react";
import {Scopes, SpotifyAuth} from "react-spotify-auth";
import {getCookie} from "typescript-cookie";

const dataStore: DataStore = new DataStore();
const controller: TrackLoaderController = new TrackLoaderController(dataStore);
export const App = () => {

  const cookie: string | undefined = getCookie("spotifyAuthToken");
  const [token, setToken] = React.useState(cookie);

  const renderWithToken = () => {
    return <TrackLoader authToken={token} controller={controller}/>;
  };

  const renderAuthRequest = () => {
    const scopes = [
      Scopes.playlistReadPrivate,
      Scopes.userLibraryRead,
      Scopes.userFollowRead,
      Scopes.userReadPrivate,
      Scopes.playlistReadCollaborative,
    ];
    return <div className="login">
      <SpotifyAuth redirectUri="http://localhost:8080"
                   clientID={ClientInfo.CLIENT_ID}
                   scopes={scopes}
                   onAccessToken={(token) => setToken(token)}
      />
    </div>;
  };

  return <div className="app">
    {
    }
    {token ? renderWithToken() : renderAuthRequest()}
  </div>;
};
