import {App} from "app/client/app/App";
import {UserInfo} from "app/client/app/UserInfo";
import * as React from 'react';
import * as ReactDOM from "react-dom";

var mountNode = document.getElementById("app");

const userInfo: UserInfo = new UserInfo();
export const UserContext = React.createContext(userInfo);
UserContext.displayName = "UserContext";

ReactDOM.render(<React.StrictMode>
      <UserContext.Provider value={userInfo}>
        <App/>
      </UserContext.Provider>
    </React.StrictMode>,
    mountNode);
