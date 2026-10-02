import { useState } from "react";
import TaskItem from "./TaskItem";

export default function TaskList({ tasks, now, onAdd, onToggleDone, onToggleTimer, onDelete }) {
  // Controlled inputs: React state is the single source of truth for the form.
  const [text, setText] = useState("");
  const [hours, setHours] = useState("");
  const [time, setTime] = useState("");

  function handleAdd() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd({ text: trimmed, plannedHours: hours || null, time: time || null });
    setText(""); setHours(""); setTime("");
  }

  const doneCount = tasks.filter((t) => t.done).length;
  const pct = tasks.length ? (doneCount / tasks.length) * 100 : 0;

  return (
    <div className="card">
      <div className="card-title">Today's Tasks</div>
      <div className="task-input-row">
        <input
          type="text" placeholder="What are you studying?" value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <input
          type="number" placeholder="Hrs" step="0.5" min="0.5" value={hours}
          onChange={(e) => setHours(e.target.value)}
        />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        <button onClick={handleAdd}>Add</button>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">No tasks yet - add your study plan for today</div>
      ) : (
        tasks.map((t) => (
          <TaskItem
            key={t.id} task={t} now={now}
            onToggleDone={onToggleDone} onToggleTimer={onToggleTimer} onDelete={onDelete}
          />
        ))
      )}

      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
