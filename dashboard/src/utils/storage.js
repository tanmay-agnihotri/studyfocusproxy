// Everything the dashboard saves lives in the browser's localStorage.
// localStorage only stores strings, so objects go through JSON.

const PROFILE_KEY = "studyfocus_onboarding";
const STUDENT_ID_KEY = "studyfocus_student_id";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

// ---------- Profile ----------
export const loadProfile = () => readJSON(PROFILE_KEY, null);
export const saveProfile = (profile) => localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
export const clearProfile = () => localStorage.removeItem(PROFILE_KEY);

// ---------- Tasks (one list per day) ----------
// Uses the LOCAL date, so a new day starts at the student's midnight.
function dateKey(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `studyfocus_tasks_${yyyy}-${mm}-${dd}`;
}
export const todayKey = () => dateKey(new Date());
export const loadTasks = () => readJSON(todayKey(), []);
export const saveTasks = (tasks) => localStorage.setItem(todayKey(), JSON.stringify(tasks));

// Consecutive days (looking back up to 30) with at least one completed task.
export function computeStreak() {
  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const anyDone = readJSON(dateKey(d), []).some((t) => t.done);
    if (anyDone) streak++;
    else if (i > 0) break; // today may still be empty; any earlier gap ends the streak
  }
  return streak;
}

// ---------- AI tutor ----------
export function getStudentId() {
  let id = localStorage.getItem(STUDENT_ID_KEY);
  if (!id) {
    id = "student_" + Date.now();
    localStorage.setItem(STUDENT_ID_KEY, id);
  }
  return id;
}

export const loadSetting = (key, fallback) => localStorage.getItem(key) ?? fallback;
export const saveSetting = (key, value) => localStorage.setItem(key, value);
