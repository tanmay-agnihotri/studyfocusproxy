// Small formatting helpers shared across components.

export function ageToProfile(age) {
  if (age <= 12) return "6-12";
  if (age <= 18) return "13-18";
  return "18-25";
}

// Minutes (from the proxy) -> "45s", "12m" or "1h 5m"
export function formatTime(minutes) {
  const totalSeconds = Math.round(minutes * 60);
  if (totalSeconds < 60) return totalSeconds + "s";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// Seconds -> "05:09"
export function fmtMMSS(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

export function formatDomain(d) {
  return d.replace(/^www\./, "");
}

export function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Fisher-Yates shuffle; returns a new array.
export function shuffle(list) {
  const arr = list.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
