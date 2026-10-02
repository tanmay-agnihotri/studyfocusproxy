import { useCallback, useEffect, useRef, useState } from "react";

// A message that shows for `duration` ms, then hides itself.
// Used for the reminder / break banner.
export function useTimedMessage(duration = 15000) {
  const [message, setMessage] = useState("");
  const timer = useRef(null);

  const show = useCallback(
    (text) => {
      setMessage(text);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setMessage(""), duration);
    },
    [duration]
  );

  useEffect(() => () => clearTimeout(timer.current), []);

  return [message, show];
}
