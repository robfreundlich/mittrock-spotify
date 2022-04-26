/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

export class Genre
{
  private _name: string;

  constructor(name: string)
  {
    this._name = name;
  }

  public get name(): string
  {
    return this._name;
  }
}

export const areGenresSame = (a: Genre, b: Genre): boolean => {
  // Handle null/undefined cases
  if (!a || !b)
  {
    // It's simple — if anything is null or undefined, then the only way they are the same
    // is if they are both either null or undefined.
    return (a === b);
  }

  return a.name === b.name;
}

