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
