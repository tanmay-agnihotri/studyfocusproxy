import { useCallback, useEffect, useRef } from "react";

// Like setTimeout, but cancelled automatically if the component unmounts
// (e.g. switching game tabs before the next round starts).
export function useLater() {
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  return useCallback((fn, ms) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(fn, ms);
  }, []);
}
