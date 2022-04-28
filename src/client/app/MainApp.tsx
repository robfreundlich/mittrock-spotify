/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {UserInfo} from "app/client/app/UserInfo";
import {UserContext} from "app/index";
import * as React from "react";

export const MainApp = () => {
  const userInfo: UserInfo = React.useContext(UserContext);

  return <div>Yo! person {userInfo.username}</div>;
};
