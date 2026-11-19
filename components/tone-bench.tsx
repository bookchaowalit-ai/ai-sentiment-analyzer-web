"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Pill, type Tone } from "@/components/app-shell";
import { analyze, type Analysis, type Label } from "@/lib/sentiment";

export const SAMPLE = "The fix was not easy, but the team was really helpful.";

const LABELS: Record<Exclude<Label, "empty">, { text: string; tone: Tone }> = {
  positive: { text: "Positive", tone: "green" },
  negative: { text: "Negative", tone: "red" },
  neutral: { text: "Neutral", tone: "grey" },
};

const signed = (value: number) => (value > 0 ? `+${value}` : value < 0 ? `−${Math.abs(value)}` : "0");

/** The interactive part of the page: the text field, the reading and the matched words. */
export function ToneBench() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<Analysis | null>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const fieldId = useId();
  const countId = useId();

  const read = (value: string) => setResult(analyze(value));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    read(text);
  };
  const trySample = () => {
    setText(SAMPLE);
    read(SAMPLE);
  };
  const clear = () => {
    setText("");
    setResult(null);
    field.current?.focus();
  };

  return (
    <div className="tl-bench">
      <form className="as-composer" onSubmit={submit} aria-label="Text to read">
        <label className="as-field" htmlFor={fieldId}>
          Text to read
          <textarea
            id={fieldId}
            ref={field}
            value={text}
            rows={4}
            aria-describedby={countId}
            onChange={(event) => { setText(event.target.value); setResult(null); }}
            placeholder="Paste or type a sentence, for example a review or a support reply."
          />
        </label>
        <div className="as-composer-foot">
          <p id={countId} className="as-composer-note"><span className="tl-count">{text.length}</span> characters · stays in this browser</p>
          <div className="as-composer-actions">
            <button type="button" className="as-plain" onClick={trySample}>Try a sample</button>
            {text ? <button type="button" className="as-plain" onClick={clear}>Clear</button> : null}
            <button type="submit" className="as-button">Read tone</button>
          </div>
        </div>
      </form>

      <section aria-labelledby="reading-title" aria-live="polite">
        <h2 id="reading-title" className="as-sr">Reading</h2>
        <Reading result={result} />
      </section>
    </div>
  );
}

function Reading({ result }: { result: Analysis | null }) {
  if (result === null) {
    return <div className="as-list as-empty"><strong>Nothing read yet</strong>Type or paste a sentence and choose Read tone, or try the sample.</div>;
  }
  if (result.label === "empty") {
    return <div className="as-list as-empty"><strong>No words to read</strong>The text has no letters or numbers in it. Add a sentence and try again.</div>;
  }
  const label = LABELS[result.label];
  return (
    <div className="as-run">
      <div className="tl-reading">
        <div className="tl-reading-head">
          <h3 className="as-sr">Tone</h3>
          <Pill tone={label.tone}>{label.text}</Pill>
          <span className="tl-count">Score {signed(result.score)}</span>
        </div>
        <dl className="tl-facts">
          <div><dt>Per word</dt><dd>{signed(result.comparative)}</dd></div>
          <div><dt>Words counted</dt><dd>{result.contributions.length} of {result.tokens}</dd></div>
          <div><dt>Method</dt><dd>Word list, not a model</dd></div>
        </dl>
        <p>{result.label === "neutral" && result.contributions.length === 0
          ? "No word in this text is in the word list, so it reads as neutral. That is an absence of evidence, not a verdict."
          : "A hint, not a verdict: the label comes from the score per word, and anything between −0.05 and +0.05 reads as neutral."}</p>
      </div>
      {result.contributions.length > 0 ? (
        <div>
          <h3 className="as-section-title">Words that counted</h3>
          <ul className="as-list tl-words">
            {result.contributions.map((item, index) => (
              <li key={`${item.word}-${index}`} className="as-row">
                <div>
                  <h4 className="tl-word">{item.word}</h4>
                  <p>{item.note ? item.note : "base weight"}</p>
                </div>
                <Pill tone={item.value > 0 ? "green" : item.value < 0 ? "red" : "grey"}>{signed(item.value)}</Pill>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
