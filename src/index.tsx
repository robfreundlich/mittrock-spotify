import {router} from "app/router.config";
import * as ReactDOM from "react-dom";

import "./index.css";
import App from "app/client/app/App";

console.log("setup: router:", router);

// const App = () => {
//   const [token, setToken] = React.useState(getCookie("spotifyAuthToken"));
//
//   console.log(`App, token = ${token}, router: `, router);
//
//   const renderApp = () => {
//     console.log(`App.renderApp(), router: `, router);
//     setSpotifyAuthToken(token);
//
//     return <UIRouter router={router}>
//       <UIView/>
//     </UIRouter>;
//   };
//
//   const renderAuthRequest = () => {
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
//                    onAccessToken={(token) => setToken(token)}
//       />
//     </div>;
//   };
//
//   return <React.StrictMode>
//     <div className="app">
//       {token && renderApp()}
//       {!token && renderAuthRequest()}
//     </div>
//   </React.StrictMode>;
//
// };


var mountNode = document.getElementById("app-root");

ReactDOM.render(<App/>, mountNode);
