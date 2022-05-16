/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {Transition} from "@uirouter/react";
import {spotifyAuthToken} from "app/client/app/App";
import {AppServices} from "app/client/app/AppServices";
import {LoadingDatabase} from "app/client/app/LoadingDatabase";
import {LoadingFromDatabase} from "app/client/app/LoadingFromDatabase";
import {Browser} from "app/client/browser/Browser";

export const getDataStore = () => AppServices.dataStore;
export const getAuthToken = () => spotifyAuthToken;

// Returns to the state a state came from
export const returnTo = ($transition$: Transition) => {
  if ($transition$.redirectedFrom())
  {
    // Return to the original attempted target state
    return $transition$.redirectedFrom().targetState();
  }

  let $state = $transition$.router.stateService;

  // Return them to the state they came from.
  if ($transition$.from().name !== '')
  {
    return $state.target($transition$.from(), $transition$.params("from"));
  }

  // If the fromState's name is empty, then this was the initial transition. Just return them to the browser
  return $state.target("browser");
};


// ======================== States start here -------------------

export const loadingDatabaseState = {
  name: "loadingDatabase",
  url: "/loadingDatabase",
  component: LoadingDatabase,
  requiresAuthorization: true,
  resolve: [
    {
      token: "dataStore",
      resolveFn: getDataStore
    },
    {
      token: "authToken",
      resolveFn: getAuthToken
    }
  ]
};

export const loadingFromDatabaseState = {
  name: "loadingFromDatabase",
  url: "/loadingFromDatabase",
  component: LoadingFromDatabase,
  requiresDatabase: true,
  resolve: [
    {
      token: "dataStore",
      resolveFn: getDataStore
    }
  ]
};

export const browserState = {
  name: "browser",
  url: "/browser",
  component: Browser,
  requiresDatabase: true,
  requiresDatastore: true,
  resolve: [
    {
      token: "dataStore",
      resolveFn: getDataStore
    }
  ]
};

export default [loadingDatabaseState, loadingFromDatabaseState, browserState];
