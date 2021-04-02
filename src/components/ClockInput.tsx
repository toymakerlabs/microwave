import "components/styles/ClockInput.scss";

import React, { useEffect, useRef, useState } from "react";

import ClockDigit from "components/ClockDigit";
import ControlFieldset from "components/layout/ControlFieldset";

interface ClockInputProps {
  display?: string;
  disabled?: boolean;
  onClockChanged?: (digits: string) => void;
  onClockEnterPress?: () => void;
}

export function ClockInput({
  display,
  disabled,
  onClockChanged,
  onClockEnterPress,
}: ClockInputProps): JSX.Element {
  const [displaySeconds, setDisplaySeconds] = useState("");
  const [displayMinutes, setDisplayMinutes] = useState("");

  const minutesRef = useRef<HTMLInputElement>(null);
  const secondsRef = useRef<HTMLInputElement>(null);

  const handleBlur = () => {
    !displayMinutes && setDisplayMinutes("00");
    !displaySeconds && setDisplaySeconds("00");
  };

  useEffect(() => {
    if (
      document.activeElement === minutesRef.current ||
      document.activeElement === secondsRef.current
    ) {
      return;
    }
    display && setDisplayMinutes(display?.slice(0, 2));
    display && setDisplaySeconds(display?.slice(2, 4));
  }, [display, disabled]);

  const setDigits = (minutes: string, seconds: string) => {
    const min = minutes.padStart(2, "0");
    const sec = seconds.padStart(2, "0");
    return min + sec;
  };

  const handleMinutesChanged = (name: string, value: string) => {
    onClockChanged && onClockChanged(setDigits(value, displaySeconds));
    setDisplayMinutes(value);
    if (name === "minutes" && value.length > 1) {
      secondsRef.current?.focus();
    }
  };

  const handleSecondsChanged = (name: string, value: string) => {
    onClockChanged && onClockChanged(setDigits(displayMinutes, value));
    setDisplaySeconds(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      document.activeElement === secondsRef.current ||
        document.activeElement === minutesRef.current;
      onClockEnterPress && onClockEnterPress();
    }
    if (
      e.key === "Backspace" &&
      document.activeElement === secondsRef.current
    ) {
      secondsRef.current?.value.length &&
        secondsRef.current?.value.length > 1 &&
        minutesRef.current?.focus();
    }
  };

  return (
    <ControlFieldset
      className="clock-input"
      legend={
        <>
          <span>Timer:</span>
          <time dateTime={`${+displayMinutes}m ${+displaySeconds}s`}>
            {`${displayMinutes}:${displaySeconds} min`}
          </time>
        </>
      }
    >
      <div
        className={`time-display ${
          !disabled && displayMinutes + displaySeconds !== "0000"
            ? "active"
            : ""
        } ${disabled ? "disabled" : ""}`}
      >
        <ClockDigit
          disabled={disabled}
          label="minutes"
          id="minutes-input"
          tabIndex={1}
          ref={minutesRef}
          value={displayMinutes}
          onBlur={handleBlur}
          onDigitChanged={handleMinutesChanged}
          onKeyDown={handleKeyDown}
          name={"minutes"}
        />
        <span>:</span>
        <ClockDigit
          id="seconds-input"
          tabIndex={2}
          label="seconds"
          disabled={disabled}
          ref={secondsRef}
          value={displaySeconds}
          onBlur={handleBlur}
          onDigitChanged={handleSecondsChanged}
          onKeyDown={handleKeyDown}
          name={"seconds"}
        />
      </div>
    </ControlFieldset>
  );
}
