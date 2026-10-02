import { useState } from "react";
import { SENTENCES } from "../../data/games";
import { pickRandom, shuffle } from "../../utils/format";
import { useLater } from "../../hooks/useLater";
import Feedback from "./Feedback";

function newRound() {
  const words = pickRandom(SENTENCES);
  return { words, shuffled: shuffle(words) };
}

export default function SentenceBuilder() {
  const [round, setRound] = useState(newRound);
  const [picked, setPicked] = useState([]); // positions in round.shuffled, in tap order
  const [result, setResult] = useState(null);
  const later = useLater();

  function pick(index) {
    if (result || picked.includes(index)) return;
    const next = [...picked, index];
    setPicked(next);

    if (next.length === round.words.length) {
      const sentence = next.map((i) => round.shuffled[i]).join(" ");
      const correct = sentence === round.words.join(" ");
      setResult({
        correct,
        text: correct ? "Correct sentence!" : `Good try - correct order was: ${round.words.join(" ")}`,
      });
      later(() => {
        setRound(newRound());
        setPicked([]);
        setResult(null);
      }, 2200);
    }
  }

  return (
    <>
      <div className="game-question">Tap the words in the correct order:</div>
      <div className="sentence-answer">{picked.map((i) => round.shuffled[i]).join(" ")}</div>
      <div className="sentence-words">
        {round.shuffled.map((word, i) => (
          <div
            key={i} role="button" tabIndex={0}
            className={"sentence-word" + (picked.includes(i) ? " picked" : "")}
            onClick={() => pick(i)}
            onKeyDown={(e) => e.key === "Enter" && pick(i)}
          >
            {word}
          </div>
        ))}
      </div>
      <Feedback result={result} />
    </>
  );
}
