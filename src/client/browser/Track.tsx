/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {GenresSection, ItemDisplayType} from "app/client/browser/BrowserSection";
import * as React from "react";
import {BrowserController} from "app/client/browser/BrowserController";
import {ITrack} from "app/client/model/Track";
import {SpotifyImage} from "spotify-web-api-ts/types/types/SpotifyObjects";
import {ModelUtils} from "app/client/utils/ModelUtils";
import {isTrackFavorite} from "app/client/model/TrackSource";
import {inclusionReasonObjectName} from "app/client/utils/Types";
import Dialog from "app/client/controls/Dialog";

interface TrackProps
{
  track: ITrack;
  controller: BrowserController;
  type: ItemDisplayType;
  track_num?: number | undefined;
}

export function Track(props: TrackProps)
{
  const images: SpotifyImage[] = props.track.images ?? [];

  const image: SpotifyImage | undefined = ModelUtils.getImageNearSize(images, 64);

  return <div className={`track item ${isTrackFavorite(props.track) ? "favorite-track" : ""}`} key={props.track.id}>
    <div className="track-number">{props.track_num ?? props.track.track_number}</div>
    <div className="track-image">
      {image && <img width={image.width + "px"}
                     height={image.height + "px"}
                     src={image.url}
                     alt={props.track.album?.name}
      />}
    </div>
    <div className="track-name">{props.track.name}</div>
    <div className={"track-artist"}>{props.track.artists.map((artist) => artist.name).join(",")}</div>
    <GenresSection genres={props.track.genres}
                   controller={props.controller}
                   type={props.type}/>
    <Dialog trigger={<button>Details</button>}
            title="Details"
            className="details-dialog"
            ok={true}>
      <form className="details">
        <label htmlFor="name">Name</label>
        <input type="text" readOnly={true} name="name" value={props.track.name}/>

        <label htmlFor="artist">Artist</label>
        <input type="text" readOnly={true} name="artist" value={props.track.artists.map((a) => a.name).join(",")}/>

        <label htmlFor="inclusionReasons">InclusionReasons</label>
        <textarea name="inclusionReasons" readOnly={true} rows={3} cols={40}>
          {props.track.inclusionReasons
            .map((reason) => inclusionReasonObjectName(reason, props.controller.dataStore))
            .join("\n")}
        </textarea>
      </form>
    </Dialog>
  </div>;
}
