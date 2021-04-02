import Timer from "../src/lib/timer";

describe("Timer", () => {
  jest.useFakeTimers();

  let testTimer: Timer;
  let callback: jest.Mock<any, any>;

  beforeEach(() => {
    callback = jest.fn();
    testTimer = new Timer({ duration: 1000, intervalMs: 1000 });
    testTimer.onRunningChanged.subscribe(callback);
  });

  afterEach(() => {
    testTimer.onRunningChanged.unsubscribe(callback);
  });

  test("Starts and stops after one second", () => {
    testTimer.start();
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(testTimer.running).toBe(false);
  });

  test("Sends start and finish events after one second", () => {
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(0);

    testTimer.start();

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(testTimer.running).toBe(false);
  });

  test("Stops when you tell it to", () => {
    testTimer.start();

    jest.advanceTimersByTime(500);
    expect(testTimer.running).toBe(true);

    testTimer.stop();

    jest.advanceTimersByTime(1000);
    expect(testTimer.running).toBe(false);
  });

  test("Does not double-start if already running", () => {
    testTimer.start();
    testTimer.start();
    jest.advanceTimersByTime(1000);
    expect(testTimer.elapsedTime).toBe(1000);
    expect(testTimer.running).toBe(false);
  });

  test("Does nothing if you stop a non-running timer", () => {
    expect(testTimer.running).toBe(false);
    testTimer.stop();
    jest.advanceTimersByTime(1000);
    expect(testTimer.elapsedTime).toBe(0);
  });

  test("Dispatches running changed events after started and stopped", () => {
    testTimer.duration(2000).start();

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test("Should have stopped at the duration", () => {
    testTimer.duration(2000).start();

    jest.advanceTimersByTime(4000);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(testTimer.elapsedTime).toBe(2000);
    expect(testTimer.running).toBe(false);
  });

  test("Dispatches the correct number of ticks", () => {
    const tick = jest.fn();
    testTimer.onTick.subscribe(tick);
    testTimer.duration(3000).start();

    jest.advanceTimersByTime(1000);
    expect(tick).toHaveBeenCalledTimes(1);

    testTimer.stop();

    jest.advanceTimersByTime(1000);

    testTimer.start();

    jest.advanceTimersByTime(2000);
    expect(tick).toHaveBeenCalledTimes(3);
    testTimer.onTick.unsubscribe(tick);
  });

  test("Displays the correct elapsed milliseconds", () => {
    testTimer.duration(2000).start();

    jest.advanceTimersByTime(3000);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(testTimer.elapsedTime).toBe(2000);
  });

  test("Displays the correct remaining milliseconds", () => {
    testTimer.duration(4000).start();

    jest.advanceTimersByTime(3000);
    expect(testTimer.remainingTime).toBe(1000);
  });

  test("Displays the correct status", () => {
    testTimer.duration(4000).start();
    jest.advanceTimersByTime(4000);
    expect(testTimer.running).toBe(false);
  });

  test("Clears", () => {
    testTimer.duration(4000).start();

    jest.advanceTimersByTime(3000);
    expect(testTimer.elapsedTime).toBe(3000);

    testTimer.clear();
    expect(testTimer.elapsedTime).toBe(0);
  });

  test("Clears and starts with a new duration", () => {
    testTimer.duration(4000).start();

    jest.advanceTimersByTime(3000);
    expect(testTimer.elapsedTime).toBe(3000);

    testTimer.clear();

    jest.advanceTimersByTime(1000);
    expect(testTimer.elapsedTime).toBe(0);

    testTimer.start({ duration: 2000 });

    jest.advanceTimersByTime(2000);
    expect(testTimer.elapsedTime).toBe(2000);
  });

  test("Extends by 30 seconds", () => {
    testTimer.duration(2000).start();

    jest.advanceTimersByTime(1000);
    expect(testTimer.elapsedTime).toBe(1000);

    testTimer.extend(3000);

    jest.advanceTimersByTime(4000);
    expect(testTimer.elapsedTime).toBe(5000);
    expect(testTimer.running).toBe(false);
  });

  test("Supports different intervals", () => {
    const tick = jest.fn();
    testTimer.onTick.subscribe(tick);
    testTimer.start({ intervalMs: 100 });

    jest.advanceTimersByTime(1000);
    expect(tick).toHaveBeenCalledTimes(10);
    expect(testTimer.elapsedTime).toBe(1000);
    testTimer.onTick.unsubscribe(tick);
  });

  test("Executes right away without a duration", () => {
    testTimer = new Timer({ intervalMs: 1000 });
    testTimer.start();
    expect(callback).not.toHaveBeenCalled();
    expect(testTimer.elapsedTime).toBe(0);
  });

  test("Does not break with negative values", () => {
    testTimer = new Timer({ duration: 2000, intervalMs: -1000 });
    testTimer.start();
    expect(testTimer.elapsedTime).toBe(0);
  });
});
