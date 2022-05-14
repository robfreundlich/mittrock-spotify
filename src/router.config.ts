/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {hashLocationPlugin, servicesPlugin, UIRouterReact} from '@uirouter/react';
import {AppServices} from "app/client/app/AppServices";

import appStates from './client/app/states';

// Create a new instance of the Router
export const router = new UIRouterReact();
router.plugin(servicesPlugin);
router.plugin(hashLocationPlugin);

// Lazy load visualizer...
import('@uirouter/visualizer').then(module => router.plugin(module.Visualizer));

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
router.urlService.rules.initial({state: 'loading'});
