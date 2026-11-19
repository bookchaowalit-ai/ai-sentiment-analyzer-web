// @vitest-environment happy-dom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home from "@/app/page";
import RootLayout, { metadata } from "@/app/layout";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { SAMPLE } from "@/components/tone-bench";

vi.mock("next/font/google", () => ({ Geist: () => ({ variable: "font-geist" }) }));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root;
let host: HTMLDivElement;
const $ = <T extends Element = HTMLElement>(selector: string) => host.querySelector(selector) as T | null;
const button = (text: string) => [...host.querySelectorAll("button")].find((b) => b.textContent?.trim() === text) as HTMLButtonElement | undefined;
const press = (el: Element) => act(() => { el.dispatchEvent(new MouseEvent("click", { bubbles: true })); });
const type = (value: string) => {
  const area = $("textarea") as HTMLTextAreaElement;
  act(() => {
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")!.set!;
    setter.call(area, value);
    area.dispatchEvent(new Event("input", { bubbles: true }));
  });
};
const submit = () => act(() => { ($("form") as HTMLFormElement).requestSubmit(); });

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  act(() => root.render(<Home />));
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe("Tone Lab on the App shell", () => {
  it("opens with the field, an empty reading and honest method copy", () => {
    expect($("h1")?.textContent).toBe("Read the tone of a sentence");
    expect($(".as-empty")?.textContent).toContain("Nothing read yet");
    expect(host.textContent).toContain("heuristic, not a trained model");
    expect(host.textContent).toContain("Nothing you type is sent anywhere");
    expect([...host.querySelectorAll("#how-title + .as-list h3")].map((h) => h.textContent)).toEqual(["Word weights", "Negators", "Intensifiers", "Contrast"]);
    expect($(".as-skip")?.getAttribute("href")).toBe("#main");
    expect([...host.querySelectorAll(".as-foot a")].map((a) => a.getAttribute("href"))).toContain("https://github.com/bookchaowalit-ai/ai-sentiment-analyzer-web");
    expect($('.as-foot a[href="https://bookchaowalit.com/"]')).not.toBeNull();
    // No disabled control: the button stays readable and an empty submit explains itself.
    expect(host.querySelector("button:disabled")).toBeNull();
  });

  it("reads a typed sentence and lists every word that counted", () => {
    type("I love this, it is really good");
    expect($(".as-composer-note")?.textContent).toBe("30 characters · stays in this browser");
    submit();
    expect($(".tl-reading .as-pill")?.textContent).toBe("Positive");
    expect($(".tl-reading")?.textContent).toContain("Words counted2 of 7");
    const rows = [...host.querySelectorAll(".tl-words .as-row")].map((row) => row.textContent);
    expect(rows).toEqual(["lovebase weight+3", "goodreally ×1.5+3"]);
    // Typing again drops the stale reading.
    type("I love this");
    expect($(".tl-reading")).toBeNull();
  });

  it("shows negative and neutral readings without inventing evidence", () => {
    type("This is terrible");
    submit();
    expect($(".tl-reading .as-pill")?.textContent).toBe("Negative");
    expect($(".tl-words .as-pill")?.textContent).toBe("−3");
    type("The meeting is on Tuesday");
    submit();
    expect($(".tl-reading .as-pill")?.textContent).toBe("Neutral");
    expect(host.textContent).toContain("absence of evidence, not a verdict");
    expect($(".tl-words")).toBeNull();
  });

  it("explains an empty submit instead of disabling the button", () => {
    submit();
    expect($(".as-empty")?.textContent).toContain("No words to read");
  });

  it("tries the sample and clears back to the empty state", () => {
    press(button("Try a sample")!);
    expect(($("textarea") as HTMLTextAreaElement).value).toBe(SAMPLE);
    expect($(".tl-reading .as-pill")?.textContent).toBe("Positive");
    expect(host.textContent).toContain("after “but” ×1.5");
    press(button("Clear")!);
    expect(($("textarea") as HTMLTextAreaElement).value).toBe("");
    expect(button("Clear")).toBeUndefined();
    expect($(".as-empty")?.textContent).toContain("Nothing read yet");
  });
});

describe("layout and metadata", () => {
  it("uses Geist on <html> and the site's own domain", () => {
    const html = renderToString(<RootLayout><p>child</p></RootLayout>);
    expect(html).toContain('<html lang="en" class="font-geist">');
    expect(String(metadata.metadataBase)).toBe("https://sentiment-analyzer.bookchaowalit.com/");
    expect(sitemap().map((entry) => entry.url)).toEqual(["https://sentiment-analyzer.bookchaowalit.com"]);
    expect(robots().sitemap).toBe("https://sentiment-analyzer.bookchaowalit.com/sitemap.xml");
  });
});
