/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {areIdentifiedObjectsSame, IdentifiedObject} from "app/client/model/IdentifiedObject";
import {IncludedObject} from "app/client/model/IncludedObject";
import {InclusionReason} from "app/client/utils/Types";

export interface IGenre extends IdentifiedObject, IncludedObject
{
}

export class Genre implements IGenre
{
  public id: string;

  public name: string;

  public readonly inclusionReasons: InclusionReason[];

  constructor(name: string, inclusionReasons: InclusionReason[])
  {
    this.id = name;
    this.name = name;
    this.inclusionReasons = inclusionReasons;
  }
}

export const areGenresSame = (a: IGenre, b: IGenre): boolean => {
  return areIdentifiedObjectsSame(a, b);
};

