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
    if (!source)
    {
      return;
    }

    source.forEach((value: T) => ArrayUtils.pushIfMissing(target, value, equalityCheck));
  }

  public static splitIntoChunks<T>(array: T[], size: number): T[][]
  {
    const copy: T[] = array.slice();
    const chunks: T[][] = [];
    while (copy.length !== 0)
    {
      chunks.push(copy.splice(0, size));
    }

    return chunks;
  }
}
