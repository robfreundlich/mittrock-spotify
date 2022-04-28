/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */


import * as React from "react";

type LoginState = "initial" | "code_requested" | "code_received" | "code_error" | "auth_token_requested";

export interface LoginUIProps
{

}

export interface LoginUIState
{
  loginState: LoginState;

  authState: string;

  error: string;

  code: string;

  state_received: string;
}

export class LoginUI extends React.Component<LoginUIProps, LoginUIState>
{
  constructor(props: LoginUIProps)
  {
    super(props);
    this.setState({
                    loginState: "initial",
                  });
  }

  public override render(): React.ReactNode
  {
    return null;
    // const userInfo = UserContext;

    // switch (this.state.loginState)
    // {
    //   case "initial":
    //     return this.initiateAuthorization();
    //
    //   case "code_requested":
    //     return this.codeRequested();
    //
    //   case "code_received":
    //     return this.codeReceived();
    //
    //   case "code_error":
    //     return <>
    //       <div className="code_error">${this.state.error}</div>
    //       (this.state.state_received !== this.state.authState) && <div className="bad_state_received">bad auth state received</div>
    //       </>;
    //
    //   case "auth_token_requested":
    //     return this.authTokenRequested();
    // }
  }

  // private initiateAuthorization(): React.ReactNode
  // {
  //   return <form onSubmit={async () => {
  //     const authState = ModelUtils.generateRandomString(16);
  //
  //     this.setState({
  //                     authState: authState,
  //                     loginState: "code_requested"
  //                   });
  //
  //     await axios.get("https://accounts.spotify.com/authorize?"
  //                     + queryString.stringify({
  //                                               response_type: "code",
  //                                               client_id: ClientInfo.CLIENT_ID,
  //                                               scope: ClientInfo.SCOPES.join(" "),
  //                                               redirect_uri: "http://localhost:8080/",
  //                                               state: authState
  //                                             }));
  //   }}>
  //     <button type="submit">Login</button>
  //   </form>;
  // }
  //
  // private codeRequested(): React.ReactNode
  // {
  //   const params: ParsedQuery<string> = queryString.parse(window.location.search);
  //   if (params.error)
  //   {
  //     this.setState({
  //                     loginState: "code_error",
  //                     error: params.error as string,
  //                     state_received: params.state as string,
  //                   });
  //     return null;
  //   }
  //
  //   if (params.code)
  //   {
  //     this.setState({
  //                     loginState: "code_received",
  //                     code: params.code as string,
  //                     state_received: params.state as string,
  //                   });
  //     return null;
  //   }
  //
  //   throw new Error("Unknown response");
  // }
  //
  // private codeReceived(): React.ReactNode
  // {
  //   if (this.state.state_received !== this.state.authState)
  //   {
  //     return <div className="bad_state_received">bad auth state received</div>;
  //   }
  //
  //   this.requestAuthToken();
  //
  //   return null;
  // }
  //
  //
  // private async requestAuthToken(): Promise<void>
  // {
  //   this.setState({
  //                   loginState: "auth_token_requested"
  //                 });
  //
  //   const clientInfoBuffer: Buffer = new Buffer(`${ClientInfo.CLIENT_ID}:${ClientInfo.CLIENT_SECRET}`);
  //
  //   await axios.post("https://accounts.spotify.com/api/token",
  //                    {
  //                      code: this.state.code,
  //                      redirect_uri: "http://localhost:8080",
  //                      grant_type: "authorization_code",
  //                    },
  //                    {
  //                      headers: {
  //                        "Authorization": `Basic ${clientInfoBuffer.toString("base64")}`
  //                      }
  //                    });
  // }
  //
  // private authTokenRequested()
  // {
  //   const params: ParsedQuery<string> = queryString.parse(window.location.search);
  //
  //   return undefined;
  // }
}
