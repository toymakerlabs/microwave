import "components/styles/ClockDigit.scss";

import React from "react";
import { twoDigitString } from "lib/helpers/time";

interface ClockDigitProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  name: string;
  label?: string;
  value?: string;
  max?: number;
  min?: number;
  onInputFocused?: (name: string) => void;
  onDigitChanged?: (name: string, value: string) => void;
}
const ClockDigit = React.forwardRef(
  (
    {
      name,
      max = 99,
      value = "",
      min = 0,
      onInputFocused,
      onDigitChanged,
      label,
      ...rest
    }: ClockDigitProps,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const guardedValue = twoDigitString(value);
      onDigitChanged && onDigitChanged(name, guardedValue);
    };

    const onInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.select();
      onInputFocused && onInputFocused(name);
    };

    return (
      <label htmlFor={rest.id} className="clock-digit">
        <span className="hide">{label}</span>
        <input
          {...rest}
          ref={ref}
          title={`0-99 ${name} input`}
          name={name}
          max={max}
          min={min}
          size={2}
          maxLength={2}
          onFocus={onInputFocus}
          value={value}
          onChange={onInputChange}
          type="number"
          inputMode="numeric"
          pattern="\d{2}"
        ></input>
      </label>
    );
  }
);

ClockDigit.displayName = "ClockDigit";

export default ClockDigit;
