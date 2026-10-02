import { useEffect, useRef, useState } from "react";
import { TUTOR_API } from "../config";
import { getStudentId, loadSetting, saveSetting } from "../utils/storage";
import { speak, stopSpeaking, createRecognition } from "../hooks/useSpeech";
import ChatMessage from "./ChatMessage";

const GREETING =
  "Hi! I'm your study tutor. Tell me what you're working on, and I'll help you understand it " +
  "step by step - not just hand you the answer, but actually help it click.";
const UNSUPPORTED = "Voice input isn't supported in this browser - try Chrome or Safari.";

export default function TutorTab({ active }) {
  // ---------- What the screen shows (state) ----------
  const [messages, setMessages] = useState([]); // { id, role, text, links }
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [statusBanner, setStatusBanner] = useState("");
  const [notesStatus, setNotesStatus] = useState("");
  const [autoSpeak, setAutoSpeak] = useState(() => loadSetting("studyfocus_auto_speak", "0") === "1");
  const [voiceLang, setVoiceLang] = useState(() => loadSetting("studyfocus_voice_lang", "en-IN"));
  const [voiceMode, setVoiceMode] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("");
  const [listening, setListening] = useState(false);

  // ---------- Values the speech callbacks need to read live (refs) ----------
  // Speech-recognition callbacks are created once, so they read these refs
  // instead of state, which would be stale inside those callbacks.
  const historyRef = useRef([]); // conversation sent to the backend each time
  const initializedRef = useRef(false);
  const nextIdRef = useRef(0);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const voiceModeRef = useRef(false);
  const gotResultRef = useRef(false);
  const voiceLangRef = useRef(voiceLang);
  const autoSpeakRef = useRef(autoSpeak);
  const sendRef = useRef(null);

  useEffect(() => { voiceLangRef.current = voiceLang; saveSetting("studyfocus_voice_lang", voiceLang); }, [voiceLang]);
  useEffect(() => { autoSpeakRef.current = autoSpeak; saveSetting("studyfocus_auto_speak", autoSpeak ? "1" : "0"); }, [autoSpeak]);

  // Keep the newest message in view.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages, sending]);

  // First time the tab is opened: greet and check the backend.
  useEffect(() => {
    if (!active || initializedRef.current) return;
    initializedRef.current = true;
    addMessage("assistant", GREETING);
    checkTutorStatus();
  }, [active]);

  // Stop the mic and any speech if this component goes away.
  useEffect(() => () => {
    voiceModeRef.current = false;
    try { recognitionRef.current?.stop(); } catch { /* not running */ }
    stopSpeaking();
  }, []);

  function addMessage(role, text, links) {
    const id = nextIdRef.current++;
    setMessages((prev) => [...prev, { id, role, text, links }]);
  }

  async function checkTutorStatus() {
    try {
      const res = await fetch(TUTOR_API + "/health");
      const data = await res.json();
      setStatusBanner(
        data.llm_configured
          ? ""
          : "Tutor backend is running, but no API key is set yet - add GROQ_API_KEY to .env"
      );
    } catch {
      setStatusBanner("Tutor backend not reachable - run: uvicorn main:app --reload --port 8000");
    }
  }

  // ---------- Sending a message ----------
  async function send(textArg) {
    const text = (textArg ?? input).trim();
    if (!text) return;

    addMessage("user", text);
    setInput("");
    setSending(true);

    try {
      const res = await fetch(TUTOR_API + "/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: getStudentId(), message: text, history: historyRef.current }),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      historyRef.current = [
        ...historyRef.current,
        { role: "user", content: text },
        { role: "assistant", content: data.reply },
      ];
      addMessage("assistant", data.reply, data.suggested_links);
      replyAloud(data.reply);
    } catch {
      addMessage("system", `Could not reach the tutor backend at ${TUTOR_API}. Is it running?`);
    } finally {
      setSending(false);
    }
  }
  sendRef.current = send;

  function replyAloud(text) {
    if (voiceModeRef.current) {
      setVoiceStatus("🔊 Tutor speaking...");
      speak(text, () => {
        if (voiceModeRef.current) listenForVoiceMode();
      });
    } else if (autoSpeakRef.current) {
      speak(text);
    }
  }

  // ---------- Voice input ----------
  function getRecognition() {
    if (recognitionRef.current) return recognitionRef.current;
    const rec = createRecognition();
    if (!rec) return null;

    rec.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      gotResultRef.current = true;
      if (voiceModeRef.current) sendRef.current(transcript);
    };
    rec.onend = () => {
      setListening(false);
      if (voiceModeRef.current && !gotResultRef.current) retryListening();
    };
    rec.onerror = (event) => {
      setListening(false);
      if (!voiceModeRef.current) return;
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        addMessage("system", "Microphone access was blocked - voice conversation stopped.");
        stopVoiceMode();
      } else {
        retryListening();
      }
    };
    recognitionRef.current = rec;
    return rec;
  }

  function retryListening() {
    setVoiceStatus("Didn't catch that - listening again...");
    setTimeout(() => {
      if (voiceModeRef.current) listenForVoiceMode();
    }, 700);
  }

  function beginListening() {
    const rec = getRecognition();
    if (!rec) return false;
    rec.lang = voiceLangRef.current;
    gotResultRef.current = false;
    try { rec.start(); } catch { /* already listening */ }
    setListening(true);
    return true;
  }

  function listenForVoiceMode() {
    setVoiceStatus("🎤 Listening...");
    if (!beginListening()) {
      addMessage("system", UNSUPPORTED);
      voiceModeRef.current = false;
      setVoiceMode(false);
    }
  }

  function stopVoiceMode() {
    voiceModeRef.current = false;
    setVoiceMode(false);
    try { recognitionRef.current?.stop(); } catch { /* not running */ }
    stopSpeaking();
    setListening(false);
  }

  function toggleVoiceMode() {
    if (voiceModeRef.current) {
      stopVoiceMode();
    } else {
      voiceModeRef.current = true;
      setVoiceMode(true);
      listenForVoiceMode();
    }
  }

  function toggleMic() {
    if (listening) {
      try { recognitionRef.current?.stop(); } catch { /* not running */ }
      setListening(false);
      return;
    }
    if (!beginListening()) addMessage("system", UNSUPPORTED);
  }

  // ---------- Uploading notes ----------
  async function uploadNotes(event) {
    const file = event.target.files[0];
    if (!file) return;
    setNotesStatus("Uploading...");

    const formData = new FormData();
    formData.append("student_id", getStudentId());
    formData.append("file", file);

    try {
      const res = await fetch(TUTOR_API + "/upload-notes", { method: "POST", body: formData });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      setNotesStatus(`✓ ${data.filename} added (${data.chunks_stored} sections)`);
      addMessage("system", `Notes from "${data.filename}" have been added - I'll use them when relevant.`);
    } catch {
      setNotesStatus("Upload failed - is the backend running?");
    } finally {
      event.target.value = ""; // allow uploading the same file again
    }
  }

  return (
    <>
      {statusBanner && <div className="status-banner">{statusBanner}</div>}

      <div className="chat-card">
        <div className="messages">
          {messages.map((m) => <ChatMessage key={m.id} message={m} />)}
          <div ref={messagesEndRef} />
        </div>
        <div className={"typing-indicator" + (sending ? " show" : "")}>Tutor is typing...</div>
        <div className="chat-input-row">
          <button
            className={"mic-btn" + (listening ? " listening" : "")}
            onClick={toggleMic} title="Speak your question"
          >
            🎤
          </button>
          <input
            type="text" placeholder="What are you studying today?" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !sending && send()}
          />
          <button onClick={() => send()} disabled={sending}>Send</button>
        </div>
      </div>

      <div className="speak-toggle-row">
        <button className="pomodoro-start" style={{ padding: "10px 18px" }} onClick={toggleVoiceMode}>
          {voiceMode ? "⏹ End Voice Conversation" : "🎤 Start Voice Conversation"}
        </button>
        <button
          className="pomodoro-reset" style={{ padding: "10px 14px", opacity: voiceLang === "en-IN" ? 1 : 0.5 }}
          onClick={() => setVoiceLang("en-IN")}
        >
          EN
        </button>
        <button
          className="pomodoro-reset" style={{ padding: "10px 14px", opacity: voiceLang === "hi-IN" ? 1 : 0.5 }}
          onClick={() => setVoiceLang("hi-IN")}
        >
          हिंदी
        </button>
      </div>

      {voiceMode && (
        <div className="speak-toggle-row">
          <span className="voice-status-text">{voiceStatus}</span>
        </div>
      )}

      <div className="speak-toggle-row">
        <label>
          <input type="checkbox" checked={autoSpeak} onChange={(e) => setAutoSpeak(e.target.checked)} />
          Read tutor replies aloud automatically
        </label>
      </div>

      <div className="notes-bar">
        <label>
          Upload notes (PDF or text)
          <input type="file" accept=".pdf,.txt" onChange={uploadNotes} />
        </label>
        <span className="notes-status">{notesStatus}</span>
      </div>
    </>
  );
}
