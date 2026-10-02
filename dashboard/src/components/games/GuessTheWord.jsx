import { useState } from "react";
import { useLater } from "../../hooks/useLater";
import Feedback from "./Feedback";

// Shared layout for Word Scramble and Emoji Riddle:
// show a puzzle, type a guess, check it, then load a new round.
export default function GuessTheWord({ prompt, newRound, normalize, rightText, wrongText, puzzleStyle }) {
  const [round, setRound] = useState(newRound);
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState(null);
  const later = useLater();

  function check() {
    if (result) return;
    const correct = normalize(guess) === round.answer;
    setResult({ correct, text: correct ? rightText : wrongText(round.answer) });
    later(() => {
      setRound(newRound());
      setGuess("");
      setResult(null);
    }, 1800);
  }

  return (
    <>
      <div className="game-question">{prompt}</div>
      <div className="word-scramble" style={puzzleStyle}>{round.puzzle}</div>
      <div className="game-input-row">
        <input
          type="text" placeholder="Your answer" value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && check()}
        />
        <button onClick={check}>Check</button>
      </div>
      <Feedback result={result} />
    </>
  );
}
