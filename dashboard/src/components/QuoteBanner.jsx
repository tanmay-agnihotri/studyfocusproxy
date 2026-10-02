import { useState } from "react";
import { QUOTES } from "../data/quotes";
import { pickRandom } from "../utils/format";
import { useInterval } from "../hooks/useInterval";

export default function QuoteBanner() {
  const [quote, setQuote] = useState(() => pickRandom(QUOTES));
  useInterval(() => setQuote(pickRandom(QUOTES)), 15000);
  const [text, author] = quote;

  return (
    <div className="quote-banner">
      <div className="quote-text">"{text}"</div>
      <div className="quote-author">— {author}</div>
    </div>
  );
}
