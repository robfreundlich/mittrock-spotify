/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {IdentifiedObject} from "app/client/model/IdentifiedObject";
import {Track} from "app/client/model/Track";
import {Album} from "app/client/model/Album";

export const doesObjectMatch = (value: string, object: IdentifiedObject): boolean => {
  let val: string = value.toLowerCase();
  
  const matches = (checkValue: string): boolean => {
    return checkValue.toLowerCase().indexOf(val) !== -1;
  }
  
  if (matches(object.name))
  {
    return true;
  }
  
  if (object instanceof Track)
  {
    if (matches(object.album?.name ?? ""))
    {
      return true;
    }

    if (object.artists.some((artist) => matches(artist.name)))
    {
      return true;
    }

    if (object.genres.some((genre) => matches(genre.name)))
    {
      return true;
    }
  }

  if (object instanceof Album)
  {

    if (object.artists.some((artist) => matches(artist.name)))
    {
      return true;
    }

    let isMatch: boolean = false;
    object.tracks.forEach((track) => {
      if (track.genres.some((genre) => matches(genre.name)))
      {
        isMatch = true;
      }
    });

    if  (isMatch)
    {
      return true;
    }
  }
  
  return false;
}