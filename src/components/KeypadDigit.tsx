import "components/styles/KeypadDigit.scss";

import React from "react";

interface KeypadInputButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  digit: number;
}
export function KeypadDigit({
  digit,
  ...rest
}: KeypadInputButtonProps): JSX.Element {
  return (
    <div className="keypad-digit">
      <button {...rest} data-value={digit} className={"super-button"}>
        <span className="text">{digit}</span>
      </button>
    </div>
  );
}
