import { useCallback, useEffect, useRef, useState } from "react";

export interface Lap {
  id: number;
  time: number; // ms at the moment of recording
  lapTime: number; // duration of just this lap
  isBest: boolean;
  isWorst: boolean;
}

export type StopwatchState = "idle" | "running" | "paused";

export function useStopwatch() {
  const [state, setState] = useState<StopwatchState>("idle");
  const [elapsed, setElapsed] = useState(0); // total ms
  const [lapElapsed, setLapElapsed] = useState(0); // ms since last lap
  const [laps, setLaps] = useState<Lap[]>([]);

  const startTimeRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0); // ms before last pause
  const lapStartRef = useRef<number>(0); // ms total at lap start
  const lapAccRef = useRef<number>(0); // lap ms before last pause
  const frameRef = useRef<number | null>(null);
  const lapCounterRef = useRef(0);

  const tick = useCallback(() => {
    const now = Date.now();
    const total = accumulatedRef.current + (now - startTimeRef.current);
    const lap = lapAccRef.current + (total - lapStartRef.current);
    setElapsed(total);
    setLapElapsed(lap);
    frameRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(() => {
    startTimeRef.current = Date.now();
    lapStartRef.current = accumulatedRef.current;
    lapAccRef.current = 0;
    setState("running");
  }, []);

  const resume = useCallback(() => {
    startTimeRef.current = Date.now();
    // lapStartRef stays the same; lapAccRef already holds the paused lap time
    setState("running");
  }, []);

  const pause = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    const now = Date.now();
    accumulatedRef.current += now - startTimeRef.current;
    lapAccRef.current += accumulatedRef.current - lapStartRef.current;
    lapStartRef.current = accumulatedRef.current;
    setState("paused");
  }, []);

  const reset = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    accumulatedRef.current = 0;
    lapAccRef.current = 0;
    lapStartRef.current = 0;
    lapCounterRef.current = 0;
    setElapsed(0);
    setLapElapsed(0);
    setLaps([]);
    setState("idle");
  }, []);

  const recordLap = useCallback(() => {
    const currentTotal =
      accumulatedRef.current + (Date.now() - startTimeRef.current);
    const lapTime = lapAccRef.current + (currentTotal - lapStartRef.current);

    lapStartRef.current = currentTotal;
    lapAccRef.current = 0;
    lapCounterRef.current += 1;

    const newLapId = lapCounterRef.current;

    setLaps((prev) => {
      const newLap: Lap = {
        id: newLapId,
        time: currentTotal,
        lapTime,
        isBest: false,
        isWorst: false,
      };
      const all = [newLap, ...prev];

      if (all.length > 1) {
        const times = all.map((l) => l.lapTime);
        const best = Math.min(...times);
        const worst = Math.max(...times);
        return all.map((l) => ({
          ...l,
          isBest: l.lapTime === best,
          isWorst: l.lapTime === worst,
        }));
      }
      return all;
    });
  }, []);

  // rAF loop
  useEffect(() => {
    if (state === "running") {
      frameRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [state, tick]);

  return {
    state,
    elapsed,
    lapElapsed,
    laps,
    start,
    resume,
    pause,
    reset,
    recordLap,
  };
}
