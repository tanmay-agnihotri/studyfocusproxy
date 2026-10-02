// Seconds tracked on a task, including the part that is still running.
export function liveSeconds(task, now) {
  if (!task.running) return task.trackedSeconds;
  return task.trackedSeconds + Math.max(0, Math.floor((now - task.runStartedAt) / 1000));
}
