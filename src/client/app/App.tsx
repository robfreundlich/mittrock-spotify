/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import * as React from "react";
import {getCookie} from "typescript-cookie";
import {router} from "app/router.config";
import {setSpotifyAuthToken} from "app/client/app/Authorization";
import {UIRouter, UIView} from "@uirouter/react";
import {Scopes, SpotifyAuth} from "react-spotify-auth";
import {ClientInfo} from "app/client/app/ClientInfo";

const App = () => {
  const [token, setToken] = React.useState(getCookie("spotifyAuthToken"));

  console.log(`App, token = ${token}, router: `, router);

  const renderApp = () => {
    console.log(`App.renderApp(), router: `, router);
    setSpotifyAuthToken(token);

    return <UIRouter router={router}>
      <UIView/>
    </UIRouter>;
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

  return <React.StrictMode>
    <div className="app">
      {token && renderApp()}
      {!token && renderAuthRequest()}
    </div>
  </React.StrictMode>;

};

export default App;