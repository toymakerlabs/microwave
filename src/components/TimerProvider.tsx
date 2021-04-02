import React, { createContext, useContext, useEffect, useState } from "react";

import Timer from "lib/timer";

type TimerProviderProps = {
  children: React.ReactNode;
};

interface TimerState {
  running: boolean;
  elapsedTime: number;
  timer: Timer;
}

// The timer context solves a couple of things: First
// it gives a way for components to track the timer
// state. Additionally, it ensures that one timer is
// used and the same timer is exposed ; and we're not binding
// events to different timers. Additionally, we can
// bind and unbind our listeners from one place.

// Create a new timer
const t = new Timer();

// Set up an initial state for what we want to track
const initialTimerState = {
  running: false,
  elapsedTime: 0,
  timer: t,
};

// Create a context for the timer

const TimerContext = createContext(initialTimerState);
/**
 * Expose the running state, elapsed time and the timer to
 * components.
 */
export const TimerProvider = ({
  children,
}: TimerProviderProps): JSX.Element => {
  const [timer] = useState(t);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [running, setRunning] = useState(false);

  // I would handle reading from local storage here
  // in a useEffect and set the state based on the values

  useEffect(() => {
    timer.onTick.subscribe(setElapsedTime);
    timer.onRunningChanged.subscribe(setRunning);
    return () => {
      timer.onTick.unsubscribe(setElapsedTime);
      timer.onRunningChanged.unsubscribe(setRunning);
    };
  }, []);

  return (
    <TimerContext.Provider value={{ elapsedTime, running, timer }}>
      {children}
    </TimerContext.Provider>
  );
};

// Exports a hook that can be used in the components
export function useTimer(): TimerState {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
}
