/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

export class ModelUtils
{
  private static readonly BASE62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  public static generateId(): string
  {
    return ModelUtils.generateRandomString(22);
  }

  public static generateRandomString(length: number): string
  {
    let s: string = "";
    for (let i = 0; i < length; i++)
    {
      s = s + ModelUtils.BASE62.charAt(Math.floor(Math.random() * ModelUtils.BASE62.length));
    }

    return s;
  }
}
