/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {InclusionReason} from "app/client/utils/Types";

export interface IncludedObject
{
  inclusionReasons: InclusionReason[];

  addIncludedReason?: (reason: InclusionReason) => void;
}
