/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {UserInfo} from "app/client/app/UserInfo";
import * as React from "react";

export interface MainAppProps
{
  user: UserInfo;
}

export const MainApp = (props: MainAppProps) => {
  return <div>Yo! person {props.user.username}</div>
}
