/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

export const compareByName = (a: { name: string }, b: { name: string }) => {
  return a.name.localeCompare(b.name);
};

export const compareByAddedAt = (a: { name: string, addedAt: Date | undefined }, b: { name: string, addedAt: Date | undefined }) => {
  if ((a.addedAt === undefined) || (b.addedAt === undefined))
  {
    if ((a.addedAt === undefined) && (b.addedAt === undefined))
    {
      return compareByName(a, b);
    }

    if (a.addedAt === undefined)
    {
      return -1;
    }

    return 1;
  }

  if (a.addedAt.getTime() === b.addedAt.getTime())
  {
    return compareByName(a, b);
  }

  return a.addedAt.getTime() - b.addedAt.getTime();
};

export const compareByAddedAtDesc = (a: { name: string, addedAt: Date | undefined }, b: { name: string, addedAt: Date | undefined }) => {
  return -1 * compareByAddedAt(a, b);
};
