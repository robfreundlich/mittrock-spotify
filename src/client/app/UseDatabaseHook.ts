/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {HookResult, Transition} from "@uirouter/react";
import {AppServices} from "app/client/app/AppServices";

export class UseDatabaseTracksHook
{
  public static readonly criteria = {
    to: (state: any) => state.requiresDatabase
  };

  public static useDatabaseTracks(transition: Transition): HookResult
  {
    let $state = transition.router.stateService;


    return AppServices.db.tracks?.count()
                      .then((trackCount: number) => {
                        if (trackCount === 0)
                        {
                          return $state.target('loadingDatabase', undefined, {location: true, inherit: true, reload: true});
                        }

                        return true;
                      });
  }
}
