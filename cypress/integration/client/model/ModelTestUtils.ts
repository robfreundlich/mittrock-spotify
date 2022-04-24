/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

export class ModelTestUtils
{
  private static readonly BASE62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  public static generateTestId(): string
  {
    let s: string = "";
    for (let i = 0; i < 22; i++)
    {
      s = s + ModelTestUtils.BASE62.charAt(Math.floor(Math.random() * ModelTestUtils.BASE62.length));
    }

    return s;
  }
}
