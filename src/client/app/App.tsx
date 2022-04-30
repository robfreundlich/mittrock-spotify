/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {ClientInfo} from "app/client/app/ClientInfo";
import {DataStore} from "app/client/model/DataStore";
import {TrackLoader} from "app/client/model/TrackLoader";
import * as React from "react";
import {Scopes, SpotifyAuth} from "react-spotify-auth";
import {getCookie} from "typescript-cookie";

const dataStore: DataStore = new DataStore();
export const SpotifyApiContext = React.createContext("");
SpotifyApiContext.displayName = "SpotifyApi";
export const DataStoreContext = React.createContext<DataStore>(dataStore);
DataStoreContext.displayName = "DataStore";

export const App = () => {

  const cookie: string | undefined = getCookie("spotifyAuthToken");
  const [token, setToken] = React.useState(cookie);

  const renderWithToken = () => {
    return <SpotifyApiContext.Provider value={token!}>
      <DataStoreContext.Provider value={dataStore}>
        <TrackLoader/>
      </DataStoreContext.Provider>
    </SpotifyApiContext.Provider>;
  };

  const renderAuthRequest = () => {
    return <div className="login">
      <SpotifyAuth redirectUri="http://localhost:8080"
                   clientID={ClientInfo.CLIENT_ID}
                   scopes={[
                     Scopes.userLibraryRead,
                     Scopes.userLibraryModify,
                     Scopes.userFollowRead,
                     Scopes.userTopRead,
                     Scopes.userReadPrivate,
                     Scopes.userReadEmail
                   ]}
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
