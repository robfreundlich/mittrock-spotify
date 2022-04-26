/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {LoginUI} from "app/client/app/LoginUI";
import {MainApp} from "app/client/app/MainApp";
import {UserInfo} from "app/client/app/UserInfo";
import * as React from "react";

export interface AppProperties
{
  user: UserInfo;
}

export const App = (props: AppProperties) => {

  if (!props.user.loggedIn)
  {
    return <LoginUI user={props.user}/>;
  }

  return <MainApp user={props.user}/>;
}
