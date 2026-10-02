import { useState } from "react";
import { fmtMMSS } from "../utils/format";
import { useInterval } from "../hooks/useInterval";

const FOCUS = 25 * 60;
const BREAK = 5 * 60;

// Timestamp-based: we store WHEN the session ends and show (endAt - now).
// Browsers slow down timers in background tabs, but the time stays correct.
export default function Pomodoro({ onBreak }) {
  const [isFocus, setIsFocus] = useState(true);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [endAt, setEndAt] = useState(null);
  const [remaining, setRemaining] = useState(FOCUS); // seconds

  useInterval(
    () => {
      const left = Math.ceil((endAt - Date.now()) / 1000);
      if (left > 0) {
        setRemaining(left);
        return;
      }
      // Session over: switch focus <-> break and keep going.
      const nextFocus = !isFocus;
      const duration = nextFocus ? FOCUS : BREAK;
      setIsFocus(nextFocus);
      setEndAt(Date.now() + duration * 1000);
      setRemaining(duration);
      if (!nextFocus) onBreak();
    },
    running ? 500 : null
  );

  function toggle() {
    if (running) {
      setRemaining(Math.max(0, Math.ceil((endAt - Date.now()) / 1000)));
      setRunning(false);
    } else {
      setEndAt(Date.now() + remaining * 1000);
      setRunning(true);
      setStarted(true);
    }
  }

  function reset() {
    setRunning(false);
    setStarted(false);
    setIsFocus(true);
    setRemaining(FOCUS);
  }

  return (
    <div className="card pomodoro-card">
      <div className="card-title">Focus Timer (Pomodoro)</div>
      <div className="pomodoro-mode">{isFocus ? "Focus Session" : "Break Time"}</div>
      <div className="pomodoro-display">{fmtMMSS(remaining)}</div>
      <div className="pomodoro-controls">
        <button className="pomodoro-start" onClick={toggle}>
          {running ? "Pause" : started ? "Resume" : "Start"}
        </button>
        <button className="pomodoro-reset" onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
