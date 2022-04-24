/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

export interface IdentifiedObject
{
  id: string;
}

export const areIdentifiedObjectsSame = (a: IdentifiedObject, b: IdentifiedObject): boolean => {
  // Handle null/undefined cases
  if (!a || !b)
  {
    // It's simple — if anything is null or undefined, then the only way they are the same
    // is if they are both either null or undefined.
    return (a === b);
  }

  return a.id === b.id;
}
