import { fmtMMSS } from "../utils/format";
import { liveSeconds } from "../utils/tasks";

export default function TaskItem({ task, now, onToggleDone, onToggleTimer, onDelete }) {
  return (
    <div className="task-row">
      <input
        type="checkbox" className="task-checkbox"
        checked={task.done} onChange={() => onToggleDone(task.id)}
      />
      {/* React escapes this text automatically, so a task name can't inject HTML. */}
      <div className={"task-text" + (task.done ? " done" : "")}>{task.text}</div>
      {task.plannedHours && <div className="task-meta">{task.plannedHours}h planned</div>}
      {task.time && <div className="task-meta">{task.time}</div>}
      <button
        className={"task-timer-btn" + (task.running ? " running" : "")}
        onClick={() => onToggleTimer(task.id)}
      >
        {task.running ? "Pause" : "Start"}
      </button>
      <div className="task-timer-display">{fmtMMSS(liveSeconds(task, now))}</div>
      <div
        className="task-delete" role="button" tabIndex={0} aria-label="Delete task"
        onClick={() => onDelete(task.id)}
        onKeyDown={(e) => e.key === "Enter" && onDelete(task.id)}
      >
        ×
      </div>
    </div>
  );
}
