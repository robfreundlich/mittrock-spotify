/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import * as React from "react";
import {IGenre} from "app/client/model/Genre";

interface GenreProps
{
  genre: IGenre;

  onGenreClicked?: (genre: IGenre) => () => void;
}

export function Genre(props: GenreProps)
{
  return <div className="genre item"
              key={props.genre.name}
              onClick={props.onGenreClicked && props.onGenreClicked(props.genre)}>
    <div className="name">{props.genre.name}</div>
  </div>;
}