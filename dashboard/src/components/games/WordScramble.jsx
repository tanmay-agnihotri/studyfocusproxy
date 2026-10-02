import { SCRAMBLE_WORDS } from "../../data/games";
import { pickRandom, shuffle } from "../../utils/format";
import GuessTheWord from "./GuessTheWord";

function newRound() {
  const word = pickRandom(SCRAMBLE_WORDS);
  let scrambled = word;
  while (scrambled === word) scrambled = shuffle(word.split("")).join("");
  return { puzzle: scrambled, answer: word };
}

export default function WordScramble() {
  return (
    <GuessTheWord
      prompt="Unscramble this word:"
      newRound={newRound}
      normalize={(g) => g.trim().toUpperCase()}
      rightText="Correct! Great job."
      wrongText={(answer) => `Not quite - it was ${answer}`}
    />
  );
}
