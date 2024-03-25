/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import BrowserSection, {ItemDisplayType} from "app/client/browser/BrowserSection";
import {compareByName} from "app/client/utils/ComparisonFunctions";
import {ITrack} from "app/client/model/Track";
import {Track} from "app/client/browser/Track";
import * as React from "react";
import {useState} from "react";
import {BrowserController} from "app/client/browser/BrowserController";
import {AllTracksProvider, BrowserProvider} from "app/client/browser/Browser";
import {ToggleButton} from "app/client/controls/ToggleButton";

interface TracksSectionProps
{
  isAlbum: boolean;
  isPlaylist: boolean;
  provider: BrowserProvider;
  controller: BrowserController;
}

export function TracksSection(props: TracksSectionProps)
{
  const [isShowAllTracks, setIsShowAllTracks] = useState(false);

  const type: ItemDisplayType = props.isAlbum || props.isPlaylist
    ? "rows"
    : "cards";

  const onTracksOptionAllChanged = (/*event: React.MouseEvent*/) => {
    setIsShowAllTracks(!isShowAllTracks);
  };

  const tracks: ITrack[] = isShowAllTracks
    ? (props.provider as unknown as AllTracksProvider).getAllTracks()
    : props.provider.tracks;

  const tracksHeader = <span className={"tracks-header"}>
    {((props.provider as any)["getAllTracks"] !== undefined)
      && ((props.provider as any)["getAllTracks"]().length > 0)
      &&
            <ToggleButton className="tracks-option-all-label"
                          content={"Show All"}
                          value={isShowAllTracks}
                          onValueChanged={onTracksOptionAllChanged}/>

    }
    </span>;

  return <BrowserSection className={"tracks"}
                         type={type}
                         label={"Tracks"}
                         header={tracksHeader}
                         key={"tracks"}
                         controller={props.controller}
                         objects={tracks}
                         compare={props.provider.compareTracks ?? compareByName}
                         render={(track: ITrack) => <Track track={track}
                                                           controller={props.controller}
                                                           type={type}
                                                           track_num={props.isPlaylist ? (tracks.indexOf(track) + 1) : undefined}/>}/>;
}