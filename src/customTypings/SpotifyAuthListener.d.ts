/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

export default SpotifyAuthListener;

declare function SpotifyAuthListener(props: any): any;

declare namespace SpotifyAuthListener
{
    namespace propTypes
    {
        const noCookie: any;
        const localStorage: any;
        const onAccessToken: any;
    }
    namespace defaultProps
    {
        const noCookie_1: boolean;
        export {noCookie_1 as noCookie};
        const localStorage_1: boolean;
        export {localStorage_1 as localStorage};

        export function onAccessToken_1(token: any): void;

        export {onAccessToken_1 as onAccessToken};
    }
}
//# sourceMappingURL=SpotifyAuthListener.d.ts.map
