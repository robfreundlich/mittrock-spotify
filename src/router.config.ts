/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {hashLocationPlugin, servicesPlugin, UIRouterReact} from '@uirouter/react';
import {AppServices} from "app/client/app/AppServices";
import {UseDatabaseTracksHook} from "app/client/app/UseDatabaseHook";
import {UseDatastoreTracksHook} from "app/client/app/UseDatastoreTracksHook";
import appStates, {browserState, loadingFromDatabaseState} from './client/app/states';

// Create a new instance of the Router
export const router = new UIRouterReact();
router.plugin(servicesPlugin);
router.plugin(hashLocationPlugin);

// Lazy load visualizer...
// import('@uirouter/visualizer').then(module => router.plugin(module.Visualizer));

AppServices.initialize();

// Register the initial (eagerly loaded) states
appStates.forEach(state => {
  let resolve = (state as any).resolve;
  if (!resolve)
  {
    resolve = [];
  }
  resolve.push({
                 token: "router",
                 resolveFn: () => router
               });
  (state as any).resolve = resolve;
  router.stateRegistry.register(state);
});

// Global config for router
router.urlService.rules.initial({state: loadingFromDatabaseState.name});
router.urlService.rules.otherwise({state: browserState.name});

// Register the "requires Database" hook
router.transitionService.onBefore(UseDatabaseTracksHook.criteria,
                                  UseDatabaseTracksHook.useDatabaseTracks,
                                  {priority: 20});

// Register the "requires Datastore" hook
router.transitionService.onBefore(UseDatastoreTracksHook.criteria,
                                  UseDatastoreTracksHook.useDatastoreTracks,
                                  {priority: 10});
