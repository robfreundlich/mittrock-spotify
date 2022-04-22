/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IdentifiedObject} from "client/model/IdentifiedObject";

export class Genre implements IdentifiedObject
{
  private _id: string;

  private _name: string;

  constructor(name: string)
  {
    this._name = name;
  }

  public get id(): string
  {
    return this._id;
  }

  public get name(): string
  {
    return this._name;
  }
}
