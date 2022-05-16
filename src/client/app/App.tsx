/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {UIRouter, UIView} from "@uirouter/react";
import {ClientInfo} from "app/client/app/ClientInfo";
import {router} from "app/router.config";
import * as React from "react";
import {Scopes, SpotifyAuth} from "react-spotify-auth";
import {getCookie} from "typescript-cookie";

export var spotifyAuthToken: string | undefined = getCookie("spotifyAuthToken");

export const App = () => {
  const [token, setToken] = React.useState(getCookie("spotifyAuthToken"));

  const renderApp = () => {
    spotifyAuthToken = token;

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


// export class App extends React.Component
// {
//   public override render(): React.ReactNode
//   {
//     return <div className="app">
//       <UIView/>
//     </div>;
//   }
// }

// export class OldApp extends React.Component
// {
//   private controller: AppController;
//
//   constructor()
//   {
//     super({});
//     this.controller = new AppController((state: AppState) => this.onAppStateChanged(state));
//   }
//
//   private renderApp(): React.ReactNode
//   {
//     //return <TrackLoader authToken={this.token} controller={this.controller}/>;
//     return <>
//       <div className="header">
//         {this.renderHeader()}
//       </div>
//       <div className="body">
//         <Browser dataStore={this.controller.dataStore}/>
//       </div>
//       <div className="footer">Footer</div>
//     </>;
//   }
//
//   private renderHeader(): React.ReactNode
//   {
//     return <>
//       <div className="track-count">
//         {this.controller.dataStore.tracks.length} Tracks
//       </div>
//       {this.renderTrackLoaderButton()}
//       <div className="app-state">
//         {this.controller.state}
//       </div>
//     </>;
//   }
//
//   private renderAuthRequest(): React.ReactNode
//   {
//     const scopes = [
//       Scopes.playlistReadPrivate,
//       Scopes.userLibraryRead,
//       Scopes.userFollowRead,
//       Scopes.userReadPrivate,
//       Scopes.playlistReadCollaborative,
//     ];
//
//     return <div className="login">
//       <SpotifyAuth redirectUri="http://localhost:8080"
//                    clientID={ClientInfo.CLIENT_ID}
//                    scopes={scopes}
//                    onAccessToken={(token) => this.controller.setToken(token)}
//       />
//     </div>;
//   }
//
//   public override render()
//   {
//     return <div className="app">
//       {this.controller.token
//        ? this.renderApp()
//        : this.renderAuthRequest()}
//     </div>;
//   }
//
//   private renderTrackLoaderButton(): React.ReactNode
//   {
//     return <Popup trigger={<button className="button">Load</button>} modal>
//       {(close: any) =>
//           <div className="modal">
//             <TrackLoader authToken={this.controller.token} controller={this.controller.trackLoaderController}/>
//             <button className="close" onClick={() => close()}>Close</button>
//           </div>
//       }
//     </Popup>;
//   }
//
// // <TrackLoader authToken={this.controller.token} controller={this.controller.trackLoaderController}/>
//
//   private onAppStateChanged(state: AppState): void
//   {
//     this.forceUpdate();
//   }
// }
