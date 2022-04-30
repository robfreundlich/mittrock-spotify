import {App} from "app/client/app/App";
import * as React from 'react';
import * as ReactDOM from "react-dom";

var mountNode = document.getElementById("app");

ReactDOM.render(<React.StrictMode>
      <App/>
    </React.StrictMode>,
    mountNode);
