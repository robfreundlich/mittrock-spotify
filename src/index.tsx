import {UIRouter, UIView} from "@uirouter/react";
import * as React from 'react';
import * as ReactDOM from "react-dom";
import {router} from "./router.config";

var mountNode = document.getElementById("app-root");

ReactDOM.render(<React.StrictMode>
      <div className="app">
        <UIRouter router={router}>
          <UIView/>
        </UIRouter>
      </div>
    </React.StrictMode>,
    mountNode);
