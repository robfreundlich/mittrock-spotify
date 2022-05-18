/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

export const compareByName = (a: { name: string }, b: { name: string }) => {
  return a.name.localeCompare(b.name);
};
