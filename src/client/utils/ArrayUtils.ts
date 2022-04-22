/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

export class ArrayUtils
{
  public static pushIfMissing<T>(values: T[], value: T, equalityCheck?: (a: T, b: T) => boolean): boolean
  {
    let index = equalityCheck
                ? values.findIndex((entry: T) => equalityCheck(entry, value))
                : values.indexOf(value);

    if (index === -1)
    {
      values.push(value);
      return true;
    }

    return false;
  }

  public static pushAllMissing<T>(target: T[], source: T[], equalityCheck?: (a: T, b: T) => boolean): void
  {
    source.forEach((value: T) => ArrayUtils.pushIfMissing(target, value, equalityCheck));
  }
}
