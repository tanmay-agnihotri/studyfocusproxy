import { useEffect, useRef } from "react";

// Runs `callback` every `delay` ms. Pass delay = null to pause.
// The ref always holds the latest callback, so it never uses stale state.
export function useInterval(callback, delay) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
