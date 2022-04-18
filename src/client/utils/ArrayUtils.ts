/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

export class ArrayUtils
{
  public static pushIfMissing<T>(values: T[], value: T): boolean
  {
    if (values.indexOf(value) === -1)
    {
      values.push(value);
      return true;
    }

    return false;
  }

  public static pushAllMissing<T>(target: T[], source: T[]): void
  {
    source.forEach((value: T) => ArrayUtils.pushIfMissing(target, value));
  }
}
