export function twoDigitString(value: string | undefined): string {
  return String(value).replace(/[^\d]/g, "").slice(0, 2);
}

export function durationFromMMSS(minutes: number, seconds: number): number {
  return minutes * 60 * 1000 + seconds * 1000;
}

export function digitsToDuration(digits: string): number {
  const minutes = +digits.slice(0, 2);
  const seconds = +digits.slice(2, 4);
  return durationFromMMSS(minutes, seconds);
}
