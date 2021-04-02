import "styles/Main.scss";
import "styles/MainControls.scss";
import "components/styles/SuperButton.scss";

import React, { useEffect, useRef, useState } from "react";

import { ClockInput } from "components/ClockInput";
import ControlFieldset from "components/layout/ControlFieldset";
import { TimeKeypad } from "components/TimeKeypad";
import { TimerIndicator } from "components/TimerIndicator";
import { digitsToDuration } from "lib/helpers/time";
import { useTimer } from "components/TimerProvider";

/**
 * Microwave Timer Code Challenge
 * John Faithorn 2021-4-1
 *
 */

/**
 * Main application component
 * Presents MM:SS number inputs and a 0-9 keypad
 * Starts and stops a timer and presents.
 * See TimerProvider for Timer details
 */
export default function Main(): JSX.Element {
  const { elapsedTime, running, timer } = useTimer();

  // Set up the state
  const [digits, setDigits] = useState<string>("0000");
  const [duration, setDuration] = useState(0);
  const [inputSeconds, setInputSeconds] = useState(0);
  const [keypadDirty, setKeypadDirty] = useState(false);
  const [stopButtonText, setStopButtonText] = useState(
    duration && !running ? "reset" : "stop"
  );

  // Max supported duration
  const durationMax = 99 * 1000 * 60 + 99 * 1000;

  // Refs used to track focus
  const startRef = useRef<HTMLButtonElement>(null);
  const stopRef = useRef<HTMLButtonElement>(null);

  /**
   * Here I handle the case of counting down from an odd-formatted
   * time: IE: 99:99. I track the value of the seconds, and subtract
   * the difference of seconds and currentTime until catching up to
   * normal; ie going from 99 to 59.
   */
  useEffect(() => {
    const currentTime = duration - elapsedTime;
    const deltaSeconds = elapsedTime / 1000;
    const seconds = +((currentTime % 60000) / 1000).toFixed(0);
    const diff = Math.max(0, inputSeconds - seconds - deltaSeconds);
    const minutes = Math.floor(currentTime / (60 * 1000) - diff / 60);
    const digitSeconds = String(seconds + diff).padStart(2, "0");
    const digitMinutes = String(minutes).padStart(2, "0");
    setDigits(digitMinutes + digitSeconds);
  }, [elapsedTime, duration, inputSeconds]);

  useEffect(() => {
    setStopButtonText(duration && !running ? "reset" : "stop");
  }, [running, duration]);

  /**
   These respond to button actions. I would have liked to consolidate
   the keypad and the clock inputs into one component that uses the 
   state directly from the TimerProvider. That would reduce a lot of
   the logic here. Though, this was useful as a speedy exercise in
   working through some of the odd cases of keypad/number inputs.
   That would eliminate reliance on these sort of checks.
    ```if (duration && running) ...
      if (duration && !running) ..
    See components/TimerIndicator.tsx for how I would handle this.
  */

  const handleInputClockChange = (digits: string) => {
    setDuration(digitsToDuration(digits));
    setInputSeconds(+digits.slice(2, 4));
    timer.resetElapsedTime();
    setKeypadDirty(true);
  };

  const handleKeypadChange = (digits: string) => {
    timer.resetElapsedTime();
    setKeypadDirty(false);
    setDuration(digitsToDuration(digits));
    setDigits(digits);
    setInputSeconds(+digits.slice(2, 4));
  };

  const handleStart = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e && e.preventDefault();
    if (duration) {
      timer.start({ duration });
      setKeypadDirty(true);
    }
  };

  // Handle both stop and reset
  const handleStop = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e && e.preventDefault();
    if (duration && running) {
      timer.stop();
    }
    if (duration && !running) {
      timer.clear();
      setInputSeconds(0);
      setDuration(0);
    }
    setKeypadDirty(true);
  };

  // When we start the clock, focus the stop button so the user can
  // press enter to stop the timer
  const handleClockStart = () => {
    handleStart();
    setTimeout(() => {
      stopRef.current?.focus();
    });
  };

  // +30 seconds should extend the duration and reset the keypad
  // TODO(john): +30 maximum duration to account for odd entered times like 99:59
  const handleAdd30 = () => {
    if (duration + 30 * 1000 > durationMax - 40 * 1000) {
      return;
    }
    setInputSeconds(0);
    setDuration(duration + 30 * 1000);
    setKeypadDirty(true);
    timer.extend(30 * 1000);
  };

  return (
    <main role="main">
      <header>SuperWave 4000</header>
      <TimerIndicator duration={duration} />
      <ClockInput
        disabled={running}
        display={digits}
        onClockChanged={handleInputClockChange}
        onClockEnterPress={handleClockStart}
      />
      <TimeKeypad
        disabled={running}
        dirty={keypadDirty}
        onPress={handleKeypadChange}
      />
      <ControlFieldset legend="Controls" className="main-controls">
        <div>
          <button
            tabIndex={3}
            className="super-button"
            ref={startRef}
            onClick={handleStart}
          >
            start
          </button>
          <button tabIndex={5} className="super-button" onClick={handleAdd30}>
            +30
          </button>
          <button
            tabIndex={4}
            className="super-button"
            ref={stopRef}
            onClick={handleStop}
          >
            {stopButtonText}
          </button>
        </div>
      </ControlFieldset>
    </main>
  );
}
