/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import React, {useState} from 'react';
import {IdentifiedObject} from "app/client/model/IdentifiedObject";
import {areGenresSame, IGenre} from "app/client/model/Genre";
import Accordion from "app/client/controls/Accordion";
import {BrowserController} from "app/client/browser/BrowserController";
import {compareByName} from "app/client/model/ComparisonFunctions";
import {ArrayUtils} from "app/client/utils/ArrayUtils";

export interface BrowserSectionProps<T extends IGenre | IdentifiedObject>
{
  className: string;
  headerText: string;
  controller: BrowserController;
  objects: T[];
  compare: (a: T, B: T) => number;
  render: (object: T) => React.ReactNode;
}

function BrowserSection<T extends IGenre | IdentifiedObject>(props: BrowserSectionProps<T>)
{
  const [isAll, setIsAll] = useState(false);

  if (props.objects.length === 0)
  {
    return null;
  }

  const onMoreClicked = () => {
    setIsAll(!isAll);
  }

  return <Accordion className={`${props.className}`}
                    header={`${props.headerText}(${props.objects.length})`}
                    open={isAll}>
    <div className="tracks item-container">
      {props.controller.getFirstN(props.objects,
                                 props.compare,
                                 isAll ? props.objects.length : BrowserController.PREVIEW_COUNT)
        .map((object: T) => props.render(object))}

      {props.controller.hasMore(props.objects) &&
          <div className="more" key="more" onClick={onMoreClicked}>{isAll ? "Less" : "More"}...</div>}
    </div>
  </Accordion>;
}

export function GenresSection(props: {genres: IGenre[], controller: BrowserController})
{
  const [isAll, setIsAll] = useState(false);

  const onMoreClicked = () => {
    setIsAll(!isAll);
  }

  const uniqueGenres: IGenre[] = [];
  ArrayUtils.pushAllMissing(uniqueGenres, props.genres, areGenresSame);

  return (
    <div className="genres">
      {props.controller
        .getFirstN([... uniqueGenres],
                   compareByName,
                   isAll ? uniqueGenres.length : 3)
        .map((genre: IGenre, index: number) => <div className="genre"
                                                    key={`${index}`}>{genre.name}</div>)}
      {(uniqueGenres.length > 3) && <div className="genre more" onClick={onMoreClicked}>{isAll ? "<<<" : "..."}</div>}
    </div>
  );
}

export default BrowserSection;