# Design direction — Tone Lab

## World

An amber-lit language lab: dark walnut ground, paper slips, glass test marks,
and a calm instrument panel. The page makes uncertainty feel deliberate rather
than alarming, because a sentiment label without a model is not evidence.

## First viewport

The first screen puts the text sample bench beside the result panel. The visitor
types locally and presses Analyze; the interface says that nothing is sent and
that the reading comes from a word list, not a trained model.

## Palette and material

- Walnut `#1b1815` is the lab ground.
- Paper `#f2eadc` is the reading surface.
- Safelight amber `#e5a85d` marks focus and activity.
- Terracotta `#c8795f` marks the result state and heuristic caveats.
- Fine rules and specimen marks reference a print lab, not a generic dashboard.

## Type

`Libre Baskerville` gives the language surface a patient editorial voice.
`Manrope` keeps controls and explanations clear. `DM Mono` carries character
counts, endpoint state, and specimen labels.

## Interaction and states

The textarea updates a local character count. Analyze runs `lib/sentiment.ts`
(lexicon + negation + intensifiers) in the browser. The result panel shows the
label, raw and comparative score, and every contributing word with its weight;
no confidence percentage is shown because the heuristic has none. Editing the
text clears the stale result.

## Responsive rules

Desktop places input and result on one workbench. On mobile the input remains
first, the result follows, and both preserve generous reading width and visible
focus.


---

## Storybook

Storybook 10 (`@storybook/nextjs-vite`) shows this design system with the app's real CSS, tokens and fonts.

```bash
npm run storybook        # http://localhost:6006
npm run build-storybook  # static build in storybook-static/ (CI: .github/workflows/storybook.yml)
```

- **Foundations/Tokens** reads every CSS custom property the app defines at runtime, so it never drifts from the code.
- **Design/DESIGN.md** renders this file.
- **Components/**, **Sections/** and **Pages/** show the UI with mock data only (no network, analytics off).
- Toolbar: locale, theme (light / dark, when the app has a dark theme), viewports 320 / 375 / 768 / 1440. The a11y panel runs axe (WCAG 2.2 AA).
- Rule: a new shared component or page section ships with a story in `stories/`.
