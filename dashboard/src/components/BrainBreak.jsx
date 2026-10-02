import { useState } from "react";
import Trivia from "./games/Trivia";
import WordScramble from "./games/WordScramble";
import EmojiRiddle from "./games/EmojiRiddle";
import SentenceBuilder from "./games/SentenceBuilder";

const GAMES = [
  { id: "trivia", label: "Trivia", Component: Trivia },
  { id: "scramble", label: "Word Scramble", Component: WordScramble },
  { id: "emoji", label: "Emoji Riddle", Component: EmojiRiddle },
  { id: "sentence", label: "Sentence Builder", Component: SentenceBuilder },
];

export default function BrainBreak() {
  const [gameId, setGameId] = useState("trivia");
  const { Component } = GAMES.find((g) => g.id === gameId);

  return (
    <div className="card">
      <div className="card-title">Brain Break - Play Instead of Scroll</div>
      <div className="game-tabs">
        {GAMES.map((g) => (
          <button
            key={g.id}
            className={"game-tab" + (g.id === gameId ? " active" : "")}
            onClick={() => setGameId(g.id)}
          >
            {g.label}
          </button>
        ))}
      </div>
      <div className="game-area">
        {/* key={gameId} gives each game a fresh start when you switch */}
        <Component key={gameId} />
      </div>
    </div>
  );
}
