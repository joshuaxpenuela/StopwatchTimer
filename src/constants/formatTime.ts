/**
 * Formats milliseconds into mm:ss.cc (centiseconds) display.
 * e.g. 75432 → "01:15.43"
 */
export function formatTime(ms: number): string {
  const centiseconds = Math.floor((ms % 1000) / 10);
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / 60000) % 60;
  const hours = Math.floor(ms / 3600000);

  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  const cc = String(centiseconds).padStart(2, '0');

  if (hours > 0) {
    const hh = String(hours).padStart(2, '0');
    return `${hh}:${mm}:${ss}.${cc}`;
  }
  return `${mm}:${ss}.${cc}`;
}

/**
 * Splits the formatted time into the main body and the centiseconds suffix.
 */
export function splitTime(ms: number): { main: string; cents: string } {
  const full = formatTime(ms);
  const dotIdx = full.lastIndexOf('.');
  return {
    main: full.substring(0, dotIdx),
    cents: full.substring(dotIdx), // includes the dot
  };
}
