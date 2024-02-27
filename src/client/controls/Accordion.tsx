/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import React, {useState} from 'react';

export class AccordionProps
{
  header: string;
  children: any;
  open?: boolean;
  className?: string;
}

function Accordion(props: AccordionProps) {
  const [open, setOpen] = useState(!!props.open);

  const onHeaderClicked = () => {
    setOpen(!open);
  };

  return <div className={`accordion ${open ? "open" : "closed"} ${props.className}`}>
    <h1 onClick={onHeaderClicked}>{props.header}</h1>
    <div className="accordion-content">
      {props.children}
    </div>
  </div>;
}

export default Accordion;