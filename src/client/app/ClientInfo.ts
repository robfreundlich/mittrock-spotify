/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

export class ClientInfo
{
  public static readonly CLIENT_ID: string = "4eca19bd04044854b6100169c835226d";

  public static readonly CLIENT_SECRET: string = "cbfed8a9c69b4e8aa6dee48c2bf8d590";

  public static readonly SCOPES: string[] = [
    "user-modify-playback-state",
    "user-follow-modify",
    "user-read-recently-played",
    "user-read-playback-position",
    "user-read-playback-state",
    "user-read-email",
    "streaming",
    "user-top-read",
    "playlist-modify-public",
    "user-library-modify",
    "user-read-currently-playing",
    "playlist-read-private",
    "playlist-modify-private",
  ];
}
