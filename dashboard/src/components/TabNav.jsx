const TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "tutor", label: "AI Tutor" },
  { id: "guide", label: "Setup Guide" },
];

export default function TabNav({ tab, onChange }) {
  return (
    <div className="tab-nav">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={"tab-btn" + (tab === t.id ? " active" : "")}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
