import ControlFieldset from "components/layout/ControlFieldset";
import { KeypadDigit } from "components/KeypadDigit";
import React from "react";

interface KeypadInputProps {
  disabled?: boolean;
  tabEnabled?: boolean;
  onPress?: (e: React.MouseEvent<HTMLButtonElement>, digits: string) => void;
}
/**
 * Keypad:
 * A 10 key keypad with 1-9 in a grid layout or 0-9 in landscape
 */
export function Keypad({
  onPress,
  disabled = false,
  tabEnabled = false,
}: KeypadInputProps): JSX.Element {
  // When the keypad changes, trigger the callback an event on the whole component
  const onKeypadChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    const digit = e.currentTarget.dataset.value || "";
    onPress && onPress(e, digit);
  };

  // Fill an array with 10 keys, but put the 0 index last
  const keypad = Array(10)
    .fill(0)
    .map((d, i) => {
      const digit = i > 8 ? 0 : i + 1;
      return (
        <KeypadDigit
          disabled={disabled}
          key={`digit-${digit}`}
          tabIndex={tabEnabled ? i : -1}
          digit={digit}
          onClick={onKeypadChange}
        />
      );
    });

  return (
    <ControlFieldset className="keypad" legend="Numeric Keypad">
      <div className="keys">{keypad}</div>
    </ControlFieldset>
  );
}
