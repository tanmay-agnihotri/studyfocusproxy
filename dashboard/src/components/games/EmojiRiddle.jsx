import { EMOJI_RIDDLES } from "../../data/games";
import { pickRandom } from "../../utils/format";
import GuessTheWord from "./GuessTheWord";

function newRound() {
  const item = pickRandom(EMOJI_RIDDLES);
  return { puzzle: item.emoji, answer: item.answer };
}

export default function EmojiRiddle() {
  return (
    <GuessTheWord
      prompt="Guess the word from the emoji:"
      newRound={newRound}
      normalize={(g) => g.trim().toUpperCase().replace(/\s/g, "")}
      rightText="Correct! Well spotted."
      wrongText={(answer) => `Good try - it was ${answer}`}
      puzzleStyle={{ letterSpacing: "0.3em" }}
    />
  );
}
