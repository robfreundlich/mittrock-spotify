/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import React, {MouseEvent, useState} from 'react';
import {IdentifiedObject} from "app/client/model/IdentifiedObject";
import {areGenresSame, IGenre} from "app/client/model/Genre";
import Accordion from "app/client/controls/Accordion";
import {BrowserController} from "app/client/browser/BrowserController";
import {compareByName} from "app/client/utils/ComparisonFunctions";
import {ArrayUtils} from "app/client/utils/ArrayUtils";
import DelayedTextInput from "app/client/controls/DelayedTextInput";
import {doesObjectMatch} from "app/client/model/doesObjectMatch";

export type ItemDisplayType = "cards" | "rows";

export interface BrowserSectionProps<T extends IdentifiedObject>
{
  className: string;
  label: string;
  controller: BrowserController;
  objects: T[];
  compare: (a: T, B: T) => number;
  render: (object: T) => React.ReactNode;
  type?: ItemDisplayType;
  header?: React.ReactNode;
}

function BrowserSection<T extends IGenre | IdentifiedObject>(props: BrowserSectionProps<T>)
{
  const [isAll, setIsAll] = useState(false);
  const [objects, setObjects] = useState(props.objects);

  const onMoreClicked = () => {
    setIsAll(!isAll);
  }

  const isRows: boolean = (props.type === "rows");

  const label = `${props.label}(${objects.length})`;

  const onSearchValueChanged = (value: string) => {
    if (value === "")
    {
      setObjects(props.objects);
    }
    else
    {
      setObjects(props.objects.filter((object) => doesObjectMatch(value, object)));
    }
  };

  const header: React.ReactNode = <div className="browser-section-header">
    <DelayedTextInput onChange={onSearchValueChanged}/>
    {props.header}
  </div>;

  return <Accordion className={`browser-section ${props.className}`}
                    label={label}
                    header={header}
                    open={isAll}>
    <div className={`item-container ${props.type ?? "cards"}`}>
      {props.controller.getFirstN(objects,
                                 props.compare,
                                  (isRows || isAll) ? objects.length : BrowserController.PREVIEW_COUNT)
        .map((object: T) => props.render(object))}

      {!isRows && props.controller.hasMore(objects) &&
          <div className="more" key="more" onClick={onMoreClicked}>{isAll ? "Less" : "More"}...</div>}
    </div>
  </Accordion>;
}

interface GenresSectionProps
{
  genres: IGenre[];
  controller: BrowserController;
  type?: ItemDisplayType;
}

export function GenresSection(props: GenresSectionProps)
{
  const [isAll, setIsAll] = useState(props.type === "rows");

  const onMoreClicked = (event: MouseEvent) => {
    event.stopPropagation();
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
      {(props.type !== "rows") && (uniqueGenres.length > 3) && <div className="genre more" onClick={onMoreClicked}>{isAll ? "<<<" : "..."}</div>}
    </div>
  );
}

export default BrowserSection;