import "components/styles/TimerIndicator.scss";

import React, { useEffect, useState } from "react";

import { useTimer } from "./TimerProvider";

interface TimerIndicatorProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  duration: number;
}

/**
 * Circle indicator bound to the TimerProvider
 */
export function TimerIndicator({ duration }: TimerIndicatorProps): JSX.Element {
  const { elapsedTime, running } = useTimer();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(duration - elapsedTime > 0);
  }, [elapsedTime, duration]);

  const circle =
    "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831";

  return (
    <div className="timer-indicator">
      <svg viewBox="0 0 36 36" width="24" className="circular-chart">
        <path
          className={`circle ${running ? "running" : ""} ${
            enabled ? "enabled" : ""
          }`}
          strokeDasharray={` ${
            100 - Math.floor((elapsedTime / duration || 0) * 100)
          }, 100`}
          d={circle}
        />
      </svg>
    </div>
  );
}
