# Blackjack Basic Strategy Trainer / 21 点基本策略训练器

**▶ [Try it live / 在线试玩](https://k9wwh.github.io/blackjack-basic-strategy-trainer/)** — runs entirely in your browser, nothing to install. 完全在浏览器中运行，无需安装。

📖 **Docs:** [English](README.en.md) · [中文](README.cn.md)

---

A small, dependency-free web app for drilling blackjack basic strategy. It deals a starting hand plus a dealer upcard, asks for the correct play (Hit, Stand, Double, Split, or Surrender), grades your answer against an embedded strategy chart, and tracks your accuracy. Vanilla JavaScript, HTML, and CSS — no frameworks, no build step, no network requests.

一个小巧、零依赖的网页应用，用来反复练习 21 点基本策略 (basic strategy)。它会发一手起手牌和一张庄家明牌 (dealer upcard)，问你正确的打法（要牌 Hit、停牌 Stand、加倍 Double、分牌 Split 或投降 Surrender），用内置策略表给你评分并统计正确率。原生 JavaScript、HTML 和 CSS — 无框架、无构建步骤、无网络请求。

**Run locally / 本地运行:** open `index.html` in any modern browser, or serve the folder with `python -m http.server 8000`.

**Rule set the strategy tables assume / 策略表所假设的规则集:** 4–8 decks, dealer stands on soft 17 (S17), double after split allowed (DAS), late surrender. 4–8 副牌、庄家软 17 停牌 (S17)、允许分牌后加倍 (DAS)、可晚投降。

> **Disclaimer:** a training tool for learning basic strategy, not gambling advice. Basic strategy minimizes the house edge but does not eliminate it. If you gamble, do so legally and responsibly.
>
> **免责声明：** 这是学习基本策略的训练工具，不是赌博建议。基本策略只能降低庄家优势 (house edge)，无法消除它。如果你要赌博，请在合法的前提下理性对待。

License / 许可证: MIT — see [LICENSE](LICENSE).
