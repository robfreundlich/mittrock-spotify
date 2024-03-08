/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import React from 'react';

interface ToggleButtonProps
{
  content: React.ReactNode;
  value: boolean;
  onValueChanged: (value: boolean) => void;
  className?: string;
}

export function ToggleButton(props: ToggleButtonProps)
{
  const onClicked = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    props.onValueChanged(!props.value);
  };

  return <div className={`toggle-button ${props.value ? "toggle-button-on" : "toggle-button-off"} ${props.className}`}
              onClick={onClicked}>
    {props.content}
  </div>;
}
