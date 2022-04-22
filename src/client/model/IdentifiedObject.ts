/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

export interface IdentifiedObject
{
  id: string;
}

export const areIdentifiedObjectsSame = (a: IdentifiedObject, b: IdentifiedObject): boolean => {
  return a.id === b.id;
}
