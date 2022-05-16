/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

export var spotifyAuthToken: string | undefined;

export const setSpotifyAuthToken = (value: string | undefined) => {
  spotifyAuthToken = value;
};
