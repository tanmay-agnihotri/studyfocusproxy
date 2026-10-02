import { useState } from "react";
import { formatTime, formatDomain } from "../utils/format";
import { liveSeconds } from "../utils/tasks";

export default function ProgressCard({ tasks, now, streak, sites }) {
  const [open, setOpen] = useState(false);

  const done = tasks.filter((t) => t.done);
  const totalSeconds = tasks.reduce((sum, t) => sum + liveSeconds(t, now), 0);
  const hh = Math.floor(totalSeconds / 3600);
  const mm = Math.floor((totalSeconds % 3600) / 60);
  const totalLabel = hh > 0 ? `${hh}h ${mm}m` : `${mm}m`;
  const maxMinutes = Math.max(...sites.map((s) => s.minutes), 0.01);

  return (
    <div className="card progress-card" onClick={() => setOpen((o) => !o)}>
      <div className="card-title">Track Progress (tap to expand)</div>
      <div className="stats-row">
        <Stat value={totalLabel} label="time studied today" />
        <Stat value={`${done.length}/${tasks.length}`} label="tasks done" />
        <Stat value={streak} label="day streak" />
      </div>

      <div className={"progress-details" + (open ? " open" : "")}>
        <h4>Time per website</h4>
        {sites.length === 0 ? (
          <div className="empty-state">No browsing activity yet</div>
        ) : (
          sites.map((s) => (
            <div className="site-row" key={s.domain}>
              <div className="site-name">{formatDomain(s.domain)}</div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${((s.minutes / maxMinutes) * 100).toFixed(0)}%` }} />
              </div>
              <div className="site-mins">{formatTime(s.minutes)}</div>
            </div>
          ))
        )}

        <h4>Tasks completed today</h4>
        {done.length === 0 ? (
          <div className="empty-state">None yet</div>
        ) : (
          done.map((t) => (
            <div key={t.id} className="empty-state" style={{ textAlign: "left", color: "#4a2a5e" }}>
              ✓ {t.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="stat-box">
      <div className="stat-number">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
