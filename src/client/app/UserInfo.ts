/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

export class UserInfo
{
  public username: string | null;

  private _accessToken: string | null = null;

  public get accessToken(): string | null
  {
    return this._accessToken;
  }

  public get loggedIn(): boolean
  {
    console.log("Checking access token");
    return this._accessToken !== null;
  }
}
