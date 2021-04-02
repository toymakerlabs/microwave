import {
  ISignal,
  ISimpleEvent,
  SignalDispatcher,
  SimpleEventDispatcher,
} from "strongly-typed-events";

interface TimerOptions {
  duration?: number;
  intervalMs: number;
}

/**
 * A Generic Timer class for counting down to a supplied duration
 * Can be called with duration and interval millsecond options
 * like: new Timer({ duration: 1000, intervalMs: 1000 });
 */
class Timer {
  private interval: ReturnType<typeof setTimeout> | null = null;

  constructor(options?: TimerOptions) {
    Object.assign(this._options, options);
    return this;
  }

  private _tick = new SimpleEventDispatcher<number>();
  private _runningChanged = new SimpleEventDispatcher<boolean>();
  private _complete = new SignalDispatcher();
  private _currentMs = 0;
  private _paused = false;
  private _options: TimerOptions = {
    intervalMs: 1000,
  };

  /**
   * Start the interval
   *
   * @returns void
   */
  private startInterval(): void {
    if (!this._options.duration) {
      this._tick.dispatch(0);
      this._runningChanged.dispatch(false);
      return;
    }
    this._runningChanged.dispatch(true);
    this.interval = setInterval(() => {
      this._currentMs += this._options.intervalMs;
      this._tick.dispatch(this._currentMs);

      if (this._options.duration && this._currentMs >= this._options.duration) {
        this.unsetInterval();
        this._runningChanged.dispatch(false);
        this._complete.dispatch();
      }
    }, this._options.intervalMs);
  }

  /**
   * Clears the interval
   */
  private unsetInterval(): void {
    this.interval && clearInterval(this.interval);
    this.interval = null;
  }

  /**
   * Extend the currently running timer
   *
   * @param ms Number of milliseconds to extend
   * @returns Timer
   */
  public extend(ms: number): Timer {
    if (this._options.duration) this._options.duration += ms;
    return this;
  }

  /**
   * Returns the running state of the timer
   */
  public get running(): boolean {
    return !!this.interval;
  }

  /**
   * Returns the current milliseconds
   */
  public get elapsedTime(): number {
    return this._currentMs;
  }

  /**
   * Returns the difference in the set duration and current time
   */
  public get remainingTime(): number | null {
    if (!this._options.duration) {
      return 0;
    }
    return this._options.duration - this._currentMs;
  }

  /**
   * Resets the elapsed time to 0
   */
  public resetElapsedTime(): void {
    this._currentMs = 0;
    this._tick.dispatch(0);
  }
  /**
   * Set the timer duration
   *
   * @param ms milliseconds to set the duration
   * @returns Timer
   */
  public duration(ms: number): Timer {
    this._options.duration = ms;
    return this;
  }

  /**
   * Start the timer. Optionally pass a duration.
   *
   * @param options duration, interval
   * @returns
   */
  public start(options?: Partial<TimerOptions>): Timer {
    options && Object.assign(this._options, options);
    if (!this._paused) {
      this._currentMs = 0;
    }
    if (!this.interval) {
      this.startInterval();
      this._paused = false;
    }
    return this;
  }

  /**
   * Stop the timer. Dispatches a running changed event.
   * @returns Timer
   */
  public stop(): Timer {
    this.interval && this.unsetInterval();
    this._runningChanged.dispatch(false);
    this._paused = true;
    return this;
  }

  /**
   * Clear the current timer and dispatch a running changed event.
   * @returns Timer
   */
  public clear(): Timer {
    this.interval && this.unsetInterval();
    this._currentMs = 0;
    this._runningChanged.dispatch(false);
    this._tick.dispatch(0);
    return this;
  }

  /**
   * Subscribe to the tick event
   */
  public get onTick(): ISimpleEvent<number> {
    return this._tick.asEvent();
  }

  /**
   * Subscribe to running changed
   */
  public get onRunningChanged(): ISimpleEvent<boolean> {
    return this._runningChanged.asEvent();
  }

  /**
   * Subscribe to timer complete event
   */
  public get complete(): ISignal {
    return this._complete.asEvent();
  }
}

export default Timer;
