/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {ClientInfo} from "app/client/app/ClientInfo";
import {ModelUtils} from "app/client/utils/ModelUtils";
import axios from "axios";
import * as queryString from "query-string";

export class UserInfo
{
  private _username: string | null;

  private _authCode: string | null;

  private _state: string;

  private _accessToken: string | null = null;

  public get authCode(): string | null
  {
    return this._authCode;
  }

  public get username(): string | null
  {
    return this._username;
  }

  public get accessToken(): string | null
  {
    return this._accessToken;
  }

  public get loggedIn(): boolean
  {
    return this._accessToken !== null;
  }

  public async login(): Promise<void>
  {
    this._state = ModelUtils.generateRandomString(16);
    await axios.get("https://accounts.spotify.com/authorize?"
                    + queryString.stringify({
                                              response_type: "code",
                                              client_id: ClientInfo.CLIENT_ID,
                                              scope: ClientInfo.SCOPES.join(" "),
                                              redirect_uri: "http://localhost:8080/",
                                              state: this._state,
                                            }));
  }

  public async processAuthorizationResponse(): Promise<void>
  {

  }

  public async requestAccessToken(code: string, state: string): Promise<void>
  {
    if ((code !== this._authCode) || (state !== this._state))
    {
      throw new Error("Authentication mismatch");
    }


  }
}
