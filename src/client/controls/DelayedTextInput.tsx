/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import React, {useEffect, useState} from 'react';

interface DelayedTextInputProps
{
  className?: string;
  onChange: (value: string) => void;
}

function DelayedTextInput(props: DelayedTextInputProps)
{
  const [value, setValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      props.onChange(value);
    }, 1000);
    return () => clearTimeout(timer);
  }, [value]);

  const onChange = (event: React.ChangeEvent) => {
    setValue((event.currentTarget as HTMLInputElement).value);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if ((event.key === "Enter") || (event.key === "Tab"))
    {
      props.onChange(value);
    }
  };

  return <input value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                placeholder="Search"
  />;
}

export default DelayedTextInput;