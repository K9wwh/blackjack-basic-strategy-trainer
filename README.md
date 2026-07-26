# Blackjack Basic Strategy Trainer

**▶ [Try it live](https://k9wwh.github.io/blackjack-basic-strategy-trainer/)** — runs entirely in your browser, nothing to install.

A small, dependency-free web app for drilling blackjack basic strategy. It deals you a starting hand and a dealer upcard, asks for the correct play (Hit, Stand, Double, Split, or Surrender), grades your answer against an embedded basic strategy chart, and tracks your accuracy as you go.

Built with vanilla JavaScript, HTML, and CSS — no frameworks, no build step, no network requests.

## Rule set the strategy tables assume

The embedded charts are the classic basic strategy for:

- **4–8 decks**
- **Dealer stands on soft 17 (S17)**
- **Double after split allowed (DAS)**
- **Late surrender available**

If you play under different rules (e.g. dealer hits soft 17, no surrender), a handful of edge cases will differ from these tables.

All scenarios are two-card starting hands, so "Double" and "Surrender" always mean the outright action — the "otherwise hit/stand" fallback cases never arise.

## How to run

No install or build required:

- **Simplest:** open `index.html` directly in any modern browser.
- **Or serve it** with any static file server, e.g.:

  ```sh
  # Python
  python -m http.server 8000

  # Node
  npx serve .
  ```

  Then browse to the printed local address.

## Features

- **Weighted scenario dealing** — instead of dealing like a real shoe (where pairs and soft hands are rare), scenarios are weighted roughly 25% pairs, 25% soft hands, 50% hard hands so you actually get practice on the tricky rows of the chart.
- **Instant grading** — every answer is checked against the embedded strategy tables, with feedback naming your hand and the dealer upcard (e.g. "hard 16 vs 10").
- **Accuracy tracking** — running correct/total count and percentage for the session.
- **Correct hand evaluation** — aces are counted as 11 and downgraded to 1 as needed; hands are classified as hard, soft, or pair, and the Split button is only enabled on actual pairs.
- **Auto-advance** — a new hand is dealt automatically after each answer (with a longer pause after a mistake so you can read the correction), plus a "New hand" button to skip ahead.
- **Zero dependencies** — three small files (`index.html`, `strategy.js`, `app.js`) plus a stylesheet; works offline.

## Project structure

| File          | Purpose                                                        |
| ------------- | -------------------------------------------------------------- |
| `index.html`  | Page layout: dealer/player card areas, action buttons, stats    |
| `strategy.js` | Embedded hard/soft/pair strategy tables and the lookup function |
| `app.js`      | Dealing, hand evaluation, rendering, grading, and stats         |
| `style.css`   | Card-table styling                                              |

## Disclaimer

This is a **training tool for learning basic strategy**, not gambling advice. Basic strategy minimizes the house edge but does not eliminate it — blackjack remains a negative-expectation game for the player. Nothing here encourages gambling or guarantees any outcome. If you gamble, do so legally and responsibly.

## License

MIT — see [LICENSE](LICENSE).
