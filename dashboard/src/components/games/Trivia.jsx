import { useState } from "react";
import { TRIVIA } from "../../data/games";
import { pickRandom } from "../../utils/format";
import { useLater } from "../../hooks/useLater";
import Feedback from "./Feedback";

export default function Trivia() {
  const [question, setQuestion] = useState(() => pickRandom(TRIVIA));
  const [choice, setChoice] = useState(null);
  const later = useLater();

  function answer(i) {
    if (choice !== null) return; // already answered this round
    setChoice(i);
    later(() => {
      setQuestion(pickRandom(TRIVIA));
      setChoice(null);
    }, 1800);
  }

  const answered = choice !== null;
  const correct = choice === question.answer;

  function optionClass(i) {
    if (!answered) return "game-option";
    if (i === question.answer) return "game-option correct";
    if (i === choice) return "game-option wrong";
    return "game-option";
  }

  return (
    <>
      <div className="game-question">{question.q}</div>
      <div className="game-options">
        {question.options.map((opt, i) => (
          <button key={opt} className={optionClass(i)} onClick={() => answer(i)}>
            {opt}
          </button>
        ))}
      </div>
      <Feedback
        result={answered && {
          correct,
          text: correct ? "Correct! Nice." : "Not quite - the answer is highlighted.",
        }}
      />
    </>
  );
}
