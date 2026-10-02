import { useState } from "react";
import { ageToProfile } from "../utils/format";

const CLASSES = [
  "Primary (1-5)", "Middle School (6-8)", "9th", "10th", "11th", "12th",
  "College - Undergraduate", "College - Postgraduate", "Competitive Exam Prep",
];
const BOARDS = ["CBSE", "ICSE", "State Board", "IB", "IGCSE", "University / College", "Other"];

export default function Onboarding({ onDone }) {
  const [age, setAge] = useState("");
  const [cls, setCls] = useState("");
  const [board, setBoard] = useState("");

  function handleSubmit() {
    const ageNum = parseInt(age, 10);
    if (!ageNum || !cls || !board) {
      alert("Please fill in all fields");
      return;
    }
    onDone({ age: ageNum, cls, board, ageGroup: ageToProfile(ageNum) });
  }

  return (
    <div id="onboarding">
      <div className="onboard-card">
        <div className="emoji-row">🌟📚🚀</div>
        <h1>StudyFocus</h1>
        <p className="sub">Let's build your personal study space and unlock your best focus yet!</p>

        <div className="onboard-field">
          <label htmlFor="ob-age">Your age</label>
          <input
            id="ob-age" type="number" min="5" max="30" placeholder="e.g. 15"
            value={age} onChange={(e) => setAge(e.target.value)}
          />
        </div>

        <div className="onboard-field">
          <label htmlFor="ob-class">Class / Year</label>
          <select id="ob-class" value={cls} onChange={(e) => setCls(e.target.value)}>
            <option value="">Select...</option>
            {CLASSES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="onboard-field">
          <label htmlFor="ob-board">Board / Curriculum</label>
          <select id="ob-board" value={board} onChange={(e) => setBoard(e.target.value)}>
            <option value="">Select...</option>
            {BOARDS.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>

        <button className="onboard-submit" onClick={handleSubmit}>Start Studying</button>
      </div>
    </div>
  );
}
