/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {HookResult, Transition} from "@uirouter/react";
import {getDataStore} from "app/client/app/states";

export class UseDatastoreTracksHook
{
  public static readonly criteria = {
    to: (state: any) => state.requiresDatastore
  };

  public static useDatastoreTracks(transition: Transition): HookResult
  {
    let $state = transition.router.stateService;

    if (getDataStore().tracks.length === 0)
    {
      return $state.target('loadingFromDatabase', undefined, {location: true, inherit: true, reload: true});
    }

    return true;
  }
}
