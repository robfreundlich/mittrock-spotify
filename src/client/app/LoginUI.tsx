/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */


import {UserInfo} from "app/client/app/UserInfo";
import * as React from "react";

export interface LoginProps
{
  user: UserInfo;
}

export const LoginUI = (props: LoginProps) => {
  if (props.user.username)
  {
    return <div>Authorizing for {props.user.username}</div>;
  }

  return <div>Need your name</div>;
}
