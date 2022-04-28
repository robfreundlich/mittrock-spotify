/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {ClientInfo} from "app/client/app/ClientInfo";
import * as React from "react";
import {Scopes, SpotifyAuth} from "react-spotify-auth";
import {getCookie} from "typescript-cookie";

const SpotifyApiContext = React.createContext("");

export const App = () => {

  const cookie: string | undefined = getCookie("spotifyAuthToken");
  const [token, setToken] = React.useState(cookie);

  return <div className="app">
    {token
     ? (
         <SpotifyApiContext.Provider value={token}>
           <div>You're logged in!</div>
         </SpotifyApiContext.Provider>
     )
     : (
         <div className="login">
           <SpotifyAuth redirectUri="http://localhost:8080"
                        clientID={ClientInfo.CLIENT_ID}
                        scopes={[Scopes.userReadPrivate, Scopes.userReadEmail]}
                        onAccessToken={(token) => setToken(token)}/>
         </div>
     )
    }
  </div>;
};
