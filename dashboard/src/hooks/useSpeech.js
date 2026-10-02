// Text-to-speech using the browser's built-in Web Speech API.
// Detects Hindi (Devanagari script) and picks the right voice language.
export function speak(text, onEnd) {
  if (!window.speechSynthesis) {
    onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = /[\u0900-\u097F]/.test(text) ? "hi-IN" : "en-IN";
  utterance.rate = 0.95;
  if (onEnd) utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  window.speechSynthesis?.cancel();
}

export function createRecognition() {
  const API = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!API) return null;
  const rec = new API();
  rec.continuous = false;
  rec.interimResults = false;
  return rec;
}
