# Blackjack Basic Strategy Trainer

**English** · [中文](README.cn.md)

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

## How scenarios are dealt

The weighting above is implemented in `dealScenario()` in `app.js`. The three branches produce genuinely distinct categories:

| Category | How the two player cards are drawn | Totals that can appear |
| -------- | ---------------------------------- | ---------------------- |
| `pair`   | one rank picked from all 13 ranks, dealt twice | any pair, including `A,A` and ten-value pairs |
| `soft`   | `A` plus a kicker from `2`–`9`      | soft 13 – soft 20      |
| `hard`   | two ranks from `2`–`K` (no aces), redrawn until the two card **values** differ | hard 5 – hard 19 |

Because the `hard` branch rejects equal card values, a hard scenario is never secretly a pair, and the `soft` branch never produces `A,A` — so the category shown on screen always matches what the strategy tables key on.

The dealer upcard is drawn uniformly from the 13 ranks, so a ten-valued upcard (`10`, `J`, `Q`, `K`) appears about four times as often as any single other upcard, as it would at a real table.

Auto-advance delays are 1100 ms after a correct answer and 2600 ms after a mistake.

## Strategy tables

The tables live in `strategy.js`. Each row is a 10-character string whose characters map to dealer upcards in this fixed order:

```
2 3 4 5 6 7 8 9 10 A
```

Action letters — these are the keys of `ACTION_NAMES` in `app.js`, the `data-action` values on the buttons in `index.html`, and the return values of `bestAction`:

| Letter | Action      |
| ------ | ----------- |
| `H`    | Hit         |
| `S`    | Stand       |
| `D`    | Double      |
| `P`    | Split       |
| `R`    | Surrender   |

The lookup function takes a distilled hand object:

```js
// hand: { isPair, pairValue, total, soft, dealerValue }
// Returns one of "H" | "S" | "D" | "P" | "R".
function bestAction(hand)
```

and resolves in this order:

1. `isPair` → `PAIR_TABLE[pairValue]`, keyed by the value of **one** card of the pair (`A` = 11, every ten-value rank = 10).
2. `soft` → `SOFT_TABLE[total]`, with `total` clamped to 13–20.
3. Hard total of 17 or more → always `S`.
4. Otherwise `HARD_TABLE[total]`, with `total` floored at 5.

Note that because step 3 short-circuits, the `17` row of `HARD_TABLE` is never actually read; it is kept in the table for readability and agrees with the short-circuit.

`HARD_TABLE`:

```
5:  "HHHHHHHHHH"
6:  "HHHHHHHHHH"
7:  "HHHHHHHHHH"
8:  "HHHHHHHHHH"
9:  "HDDDDHHHHH"
10: "DDDDDDDDHH"
11: "DDDDDDDDDH"
12: "HHSSSHHHHH"
13: "SSSSSHHHHH"
14: "SSSSSHHHHH"
15: "SSSSSHHHRH"
16: "SSSSSHHRRR"
17: "SSSSSSSSSS"
```

`SOFT_TABLE`:

```
13: "HHHDDHHHHH"
14: "HHHDDHHHHH"
15: "HHDDDHHHHH"
16: "HHDDDHHHHH"
17: "HDDDDHHHHH"
18: "SDDDDSSHHH"
19: "SSSSSSSSSS"
20: "SSSSSSSSSS"
```

`PAIR_TABLE` (keyed by the value of ONE card of the pair, `A` = 11):

```
2:  "PPPPPPHHHH"
3:  "PPPPPPHHHH"
4:  "HHHPPHHHHH"
5:  "DDDDDDDDHH"
6:  "PPPPPHHHHH"
7:  "PPPPPPHHHH"
8:  "PPPPPPPPPP"
9:  "PPPPPSPPSS"
10: "SSSSSSSSSS"
11: "PPPPPPPPPP"
```

## Project structure

| File          | Purpose                                                        |
| ------------- | -------------------------------------------------------------- |
| `index.html`  | Page layout: dealer/player card areas, action buttons, stats    |
| `strategy.js` | Embedded hard/soft/pair strategy tables and the lookup function |
| `app.js`      | Dealing, hand evaluation, rendering, grading, and stats         |
| `style.css`   | Card-table styling                                             |

`index.html` loads `strategy.js` before `app.js`; both are plain scripts sharing the global scope, so there is no module system or bundler to configure.

## Disclaimer

This is a **training tool for learning basic strategy**, not gambling advice. Basic strategy minimizes the house edge but does not eliminate it — blackjack remains a negative-expectation game for the player. Nothing here encourages gambling or guarantees any outcome. If you gamble, do so legally and responsibly.

## License

MIT — see [LICENSE](LICENSE).
