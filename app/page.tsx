import { AppFoot, AppTop } from "@/components/app-shell";
import { ToneBench } from "@/components/tone-bench";

const RULES = [
  { name: "Word weights", detail: "Each known word has a hand-set weight from −3 to +3." },
  { name: "Negators", detail: "“not” or “never” up to three words before a word flips it." },
  { name: "Intensifiers", detail: "“very” or “really” just before a word scales it." },
  { name: "Contrast", detail: "After “but” or “however”, the later clause counts 1.5× and the earlier one 0.5×." },
];

const SOURCE_URL = "https://github.com/bookchaowalit-ai/ai-sentiment-analyzer-web";

// Server-rendered page: the intro and note arrive as HTML; only the bench below is a client component.
export default function Home() {
  return (
    <div className="as">
      <a className="as-skip" href="#main">Skip to content</a>
      <AppTop name="Tone Lab" tagline="Sentiment from a word list" />
      <main id="main" tabIndex={-1} className="as-page">
        <div className="as-intro">
          <p className="as-eyebrow">Sentiment analyzer</p>
          <h1>Read the tone of a sentence</h1>
          <p>A small hand-weighted word list scores your text in this browser and shows every word it counted. It is a heuristic, not a trained model, so it gives no confidence score.</p>
        </div>
        <ToneBench />
        <section className="as-section" aria-labelledby="how-title">
          <h2 id="how-title" className="as-section-title">How it works</h2>
          <ul className="as-list">
            {RULES.map((rule) => (
              <li key={rule.name} className="as-row">
                <div>
                  <h3>{rule.name}</h3>
                  <p>{rule.detail}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="as-note">Sarcasm, context and domain language are out of reach. Nothing you type is sent anywhere.</p>
        </section>
      </main>
      <AppFoot source={SOURCE_URL} />
    </div>
  );
}
