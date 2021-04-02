import "components/styles/TimeKeypad.scss";

import React, { useEffect, useState } from "react";

import { Keypad } from "./Keypad";

interface TimeKeypadProps {
  dirty?: boolean;
  disabled?: boolean;
  maxDigits?: number;
  onPress?: (digits: string) => void;
}

/**
 * A 10 key keypad that accepts a max digits parameter. After
 * max digits is met, the keypad starts over. On press returns
 * the digits padded from the start to the value for max digits;
 * ie 0002 0012
 */
export function TimeKeypad({
  onPress,
  dirty,
  disabled,
  maxDigits = 4,
}: TimeKeypadProps): JSX.Element {
  const [digitsValue, setDigitsValue] = useState<string>("");

  useEffect(() => {
    dirty && setDigitsValue("");
  }, [dirty]);

  const onKeypadChange = (
    e: React.MouseEvent<HTMLButtonElement>,
    digit: string
  ) => {
    if (disabled) {
      return;
    }
    const updated =
      digitsValue.length === maxDigits ? digit : digitsValue + digit;

    setDigitsValue(updated);

    onPress && onPress(updated.padStart(maxDigits, "0"));
  };

  return <Keypad onPress={onKeypadChange} />;
}
