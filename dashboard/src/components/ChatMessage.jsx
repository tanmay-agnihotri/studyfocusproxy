import { speak } from "../hooks/useSpeech";

export default function ChatMessage({ message }) {
  const { role, text, links } = message;

  return (
    <>
      <div className={"msg " + role}>
        <div className="bubble">
          {text}
          {role === "assistant" && (
            <button className="speak-btn" title="Read this aloud" onClick={() => speak(text)}>
              🔊
            </button>
          )}
        </div>
      </div>

      {links?.length > 0 && (
        <div className="links-block">
          <div className="links-title">Helpful resources</div>
          {links.map((item) => (
            <div key={item.topic}>
              <a href={item.links.explanation} target="_blank" rel="noopener noreferrer">
                {item.topic} - explanation
              </a>
              <a href={item.links.youtube_search} target="_blank" rel="noopener noreferrer">
                {item.topic} - video tutorial
              </a>
              <a href={item.links.practice} target="_blank" rel="noopener noreferrer">
                {item.topic} - practice
              </a>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
