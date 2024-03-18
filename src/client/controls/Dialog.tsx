/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import React from 'react';
import Popup from "reactjs-popup";
import {PopupProps} from "reactjs-popup/dist/types";

interface DialogProps extends Omit<PopupProps, "modal">
{
  title: string;
}

function Dialog(props: DialogProps)
{
  let {className, ...rest} = {...props};

  className = className ?? "dialog";
  return <Popup className={`dialog ${className}`}
           modal={true}
           {...rest}>
      {(close: React.MouseEventHandler<HTMLDivElement> | undefined) => (
        <div className="modal">
          <div className={`header ${className}-header`}>
            <div className="header-title">{props.title}</div>
            <div className="header-close" onClick={close}>&times;</div>
          </div>
          <div className={`content ${className}-content`}>
            {props.children}
          </div>
        </div>
      )}
    </Popup>;
}

export default Dialog;