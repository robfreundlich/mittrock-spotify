import {App} from "app/client/app/App";
import {UserInfo} from "app/client/app/UserInfo";
import * as React from 'react';
import * as ReactDOM from "react-dom";

var mountNode = document.getElementById("app");
//ReactDOM.render(<App name="Jane"/>, mountNode);
ReactDOM.render(<App user={new UserInfo()}/>, mountNode);
