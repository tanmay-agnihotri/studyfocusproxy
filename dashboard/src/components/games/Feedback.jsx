// Shared "Correct!" / "Not quite" line under every game.
export default function Feedback({ result }) {
  return (
    <div className={"game-feedback" + (result ? (result.correct ? " correct" : " wrong") : "")}>
      {result?.text}
    </div>
  );
}
