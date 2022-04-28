/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import * as React from "react";

export default SpotifyAuth;

declare class SpotifyAuth extends React.Component<SpotifyAuthProps>
{
    state: {
        isAuthenticatedWithSpotify: boolean;
    };

    handleClick: (event: any) => void;

    constructor(props: any);

    render(): any;

    componentDidMount(): void;
}

declare interface SpotifyAuthProps
{
    redirectUri: string;

    clientID: string;

    scopes: string[];

    onAccessToken?: (token: any) => void;

    logoClassName?: string;

    title?: string;

    noLogo?: boolean;

    noCookie?: boolean;

    showDialog?: boolean;

    localStorage?: boolean;
}

//# sourceMappingURL=SpotifyAuth.d.ts.map
