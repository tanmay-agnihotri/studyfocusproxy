import { useEffect, useState } from "react";
import { loadTasks, saveTasks, computeStreak } from "../utils/storage";
import { liveSeconds } from "../utils/tasks";
import { useInterval } from "../hooks/useInterval";
import { useProxyStatus } from "../hooks/useProxyStatus";
import { useTimedMessage } from "../hooks/useTimedMessage";
import ReminderBanner from "./ReminderBanner";
import QuoteBanner from "./QuoteBanner";
import ProgressCard from "./ProgressCard";
import TaskList from "./TaskList";
import Pomodoro from "./Pomodoro";
import BrainBreak from "./BrainBreak";
import AllowedSites from "./AllowedSites";

export default function DashboardTab() {
  // Today's tasks are the main state of this tab. Every change is saved.
  const [tasks, setTasks] = useState(loadTasks);
  const [streak, setStreak] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [banner, showBanner] = useTimedMessage(15000);
  const { status, offline } = useProxyStatus();

  useEffect(() => {
    saveTasks(tasks);
    setStreak(computeStreak());
  }, [tasks]);

  // Tick once a second, but only while a task timer is running.
  const anyRunning = tasks.some((t) => t.running);
  useInterval(() => setNow(Date.now()), anyRunning ? 1000 : null);

  // Every 20 seconds, remind the student about a task whose start time has come.
  useInterval(() => {
    const nowStr = new Date().toTimeString().slice(0, 5); // "HH:MM"
    const due = tasks.find((t) => !t.done && !t.reminded && t.time && t.time <= nowStr);
    if (!due) return;
    setTasks((prev) => prev.map((t) => (t.id === due.id ? { ...t, reminded: true } : t)));
    showBanner(`Time to start: "${due.text}"`);
    if (window.Notification && Notification.permission === "granted") {
      new Notification("StudyFocus Reminder", { body: due.text });
    }
  }, 20000);

  // ---------- Task actions ----------
  function addTask({ text, plannedHours, time }) {
    const task = {
      id: Date.now(), text, plannedHours, time,
      done: false, reminded: false,
      trackedSeconds: 0, running: false, runStartedAt: null,
    };
    setTasks((prev) => [...prev, task]);
  }

  function toggleDone(id) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  // Start/pause a task's stopwatch. Only one task runs at a time.
  // We store the START TIMESTAMP, so elapsed time survives a page refresh.
  function toggleTimer(id) {
    const stamp = Date.now();
    setNow(stamp);
    setTasks((prev) =>
      prev.map((t) => {
        const stop = () => ({
          ...t,
          trackedSeconds: liveSeconds(t, stamp),
          running: false,
          runStartedAt: null,
        });
        if (t.id === id) return t.running ? stop() : { ...t, running: true, runStartedAt: stamp };
        return t.running ? stop() : t;
      })
    );
  }

  return (
    <>
      <ReminderBanner message={banner} />
      <QuoteBanner />
      <ProgressCard tasks={tasks} now={now} streak={streak} sites={status?.sites ?? []} />
      <TaskList
        tasks={tasks} now={now}
        onAdd={addTask} onToggleDone={toggleDone}
        onToggleTimer={toggleTimer} onDelete={deleteTask}
      />
      <Pomodoro onBreak={() => showBanner("Focus session done! Try a Brain Break game below instead of scrolling.")} />
      <BrainBreak />
      <AllowedSites status={status} offline={offline} />
      <p className="footer">StudyFocus - your time, your rules, your progress</p>
    </>
  );
}
