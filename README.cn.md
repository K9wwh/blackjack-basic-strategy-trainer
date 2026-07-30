# 21 点基本策略训练器 (Blackjack Basic Strategy Trainer)

[English](README.en.md) · **中文**

**▶ [在线试玩](https://k9wwh.github.io/blackjack-basic-strategy-trainer/)** — 完全在浏览器中运行，无需安装任何东西。

一个小巧、零依赖 (dependency-free) 的网页应用，用来反复练习 21 点基本策略 (basic strategy)。它会给你发一手起手牌和一张庄家明牌 (dealer upcard)，问你正确的打法是什么（要牌 Hit、停牌 Stand、加倍 Double、分牌 Split 还是投降 Surrender），然后用内置的基本策略表 (basic strategy chart) 给你的答案评分，并持续统计你的正确率。

使用原生 JavaScript、HTML 和 CSS 构建 — 没有框架 (framework)、没有构建步骤 (build step)、没有网络请求 (network request)。

## 策略表所假设的规则集

内置的策略表是以下经典规则下的基本策略：

- **4–8 副牌**
- **庄家软 17 点停牌 (S17，dealer stands on soft 17)**
- **允许分牌后加倍 (DAS，double after split allowed)**
- **可以晚投降 (late surrender)**

如果你玩的是别的规则（例如庄家软 17 点要牌、不允许投降），会有少数边缘情况 (edge case) 与这些表不同。

所有场景都是两张牌的起手牌，因此"加倍"和"投降"始终表示直接执行该动作 — 那些"否则要牌／停牌"的退化情形 (fallback case) 永远不会出现。

## 如何运行

无需安装，也无需构建：

- **最简单的方式：** 直接用任意现代浏览器打开 `index.html`。
- **或者用静态文件服务器 (static file server) 托管**，例如：

  ```sh
  # Python
  python -m http.server 8000

  # Node
  npx serve .
  ```

  然后访问命令打印出来的本地地址。

## 功能特性

- **加权场景发牌 (weighted scenario dealing)** — 不像真实牌靴 (shoe) 那样发牌（真实牌靴里对子和软手很少见），场景按大约 25% 对子、25% 软手 (soft hand)、50% 硬手 (hard hand) 的比例加权，这样你才能真正练到策略表里那些棘手的行。
- **即时评分 (instant grading)** — 每个答案都会与内置策略表比对，反馈中会点明你的牌型和庄家明牌（例如 "hard 16 vs 10"）。
- **正确率统计** — 本次会话 (session) 的实时正确数／总数以及百分比。
- **正确的牌值计算** — A 先按 11 计算，必要时降为 1；牌型会被归类为硬手、软手或对子 (pair)，并且只有真正成对时"Split"按钮才可用。
- **自动进入下一手 (auto-advance)** — 每次作答后会自动发下一手牌（答错时停顿更久，方便你读完纠正提示），另外还有一个"New hand"按钮可以直接跳到下一手。
- **零依赖** — 三个小文件（`index.html`、`strategy.js`、`app.js`）加一个样式表 (stylesheet)；可离线使用。

## 场景是怎么发出来的

上面提到的加权在 `app.js` 的 `dealScenario()` 中实现。三个分支产生的类别彼此确实互不重叠：

| 类别 (category) | 两张玩家牌的抽取方式 | 可能出现的点数 |
| --------------- | -------------------- | -------------- |
| `pair`   | 从全部 13 个牌面 (rank) 中抽一个，发两张 | 任意对子，包括 `A,A` 和十点对子 |
| `soft`   | `A` 加一张 `2`–`9` 的搭配牌 (kicker) | 软 13 – 软 20 |
| `hard`   | 从 `2`–`K` 中抽两个牌面（不含 A），若两张牌的**点数**相同则重抽 | 硬 5 – 硬 19 |

由于 `hard` 分支会排除点数相同的组合，硬手场景绝不会暗地里其实是个对子；而 `soft` 分支也永远不会产生 `A,A` — 所以屏幕上显示的类别始终与策略表所依据的键 (key) 一致。

庄家明牌是从 13 个牌面中均匀抽取的，因此十点明牌（`10`、`J`、`Q`、`K`）出现的频率大约是任一其他单独明牌的四倍，这与真实牌桌上的情况一致。

自动进入下一手的延迟为：答对后 1100 ms，答错后 2600 ms。

## 策略表

策略表位于 `strategy.js`。每一行都是一个 10 个字符的字符串，字符按下面这个固定顺序对应庄家明牌：

```
2 3 4 5 6 7 8 9 10 A
```

动作字母 — 它们同时是 `app.js` 中 `ACTION_NAMES` 的键、`index.html` 中按钮上的 `data-action` 值，以及 `bestAction` 的返回值：

| 字母 | 动作 |
| ------ | ----------- |
| `H`    | Hit（要牌） |
| `S`    | Stand（停牌） |
| `D`    | Double（加倍） |
| `P`    | Split（分牌） |
| `R`    | Surrender（投降） |

查表函数 (lookup function) 接收一个提炼后的牌型对象：

```js
// hand: { isPair, pairValue, total, soft, dealerValue }
// Returns one of "H" | "S" | "D" | "P" | "R".
function bestAction(hand)
```

并按以下顺序求解：

1. `isPair` → `PAIR_TABLE[pairValue]`，键是对子中**一张**牌的点数（`A` = 11，所有十点牌面都算 10）。
2. `soft` → `SOFT_TABLE[total]`，其中 `total` 被夹取 (clamp) 到 13–20。
3. 硬手总点数达到 17 或以上 → 始终为 `S`。
4. 其余情况用 `HARD_TABLE[total]`，其中 `total` 的下限为 5。

请注意：因为第 3 步会短路 (short-circuit) 返回，`HARD_TABLE` 的 `17` 行实际上永远不会被读取；保留它是为了可读性，而且它的内容与该短路结果一致。

`HARD_TABLE`：

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

`SOFT_TABLE`：

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

`PAIR_TABLE`（键是对子中"一张"牌的点数，`A` = 11）：

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

## 项目结构

| 文件          | 用途                                                        |
| ------------- | -------------------------------------------------------------- |
| `index.html`  | 页面布局：庄家／玩家牌区、动作按钮、统计信息 |
| `strategy.js` | 内置的硬手／软手／对子策略表以及查表函数 |
| `app.js`      | 发牌、牌值计算、渲染、评分与统计 |
| `style.css`   | 牌桌样式 |

`index.html` 会先加载 `strategy.js`，再加载 `app.js`；两者都是共享全局作用域 (global scope) 的普通脚本，所以没有模块系统 (module system) 或打包器 (bundler) 需要配置。

## 免责声明

这是一个**用于学习基本策略的训练工具**，不是赌博建议。基本策略能把庄家优势 (house edge) 降到最低，但并不能消除它 — 对玩家而言，21 点始终是一个负期望 (negative-expectation) 的游戏。本项目中的任何内容都不鼓励赌博，也不保证任何结果。如果你要赌博，请在合法的前提下理性对待。

## 许可证

MIT — 见 [LICENSE](LICENSE)。
