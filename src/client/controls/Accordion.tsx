/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {useState} from 'react';

export class AccordionProps
{
  label: string;
  children: any;
  open?: boolean;
  className?: string;
  header?: React.ReactNode;
}

function Accordion(props: AccordionProps) {
  const [open, setOpen] = useState(!!props.open);

  const onHeaderClicked = () => {
    setOpen(!open);
  };

  const eatClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return <div className={`accordion ${open ? "open" : "closed"} ${props.className ?? ""}`}>
    <h1 onClick={onHeaderClicked}>
      <span className="accordion-label">{props.label}</span>
      <div className="accordion-header-extra" onClick={eatClick}>{props.header}</div>
    </h1>
    {open && <div className="accordion-content">
      {props.children}
    </div>}
  </div>;
}

export default Accordion;