"use strict";

const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const SUITS = ["♠", "♥", "♦", "♣"];
const RED_SUITS = new Set(["♥", "♦"]);

const ACTION_NAMES = { H: "Hit", S: "Stand", D: "Double", P: "Split", R: "Surrender" };

const dealerCardsEl = document.getElementById("dealer-cards");
const playerCardsEl = document.getElementById("player-cards");
const handValueEl = document.getElementById("hand-value");
const feedbackEl = document.getElementById("feedback");
const statsEl = document.getElementById("stats");
const splitBtn = document.getElementById("btn-split");

let current = null;      // the scenario on the table
let awaitingChoice = false;
let handsPlayed = 0;
let correctCount = 0;

function randomOf(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function makeCard(rank) {
  return { rank, suit: randomOf(SUITS) };
}

function cardValue(rank) {
  if (rank === "A") return 11;
  if (rank === "K" || rank === "Q" || rank === "J") return 10;
  return Number(rank);
}

// Total with aces counted 11 first, then downgraded to 1 while busting.
// "soft" = an ace is still counted as 11.
function handValue(cards) {
  let total = 0;
  let aces = 0;
  for (const c of cards) {
    total += cardValue(c.rank);
    if (c.rank === "A") aces++;
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return { total, soft: aces > 0 };
}

// A basic-strategy trainer must NOT deal like a real shoe: pairs and soft
// hands would be too rare to practice. Weight the categories instead.
function dealScenario() {
  const roll = Math.random();
  let playerCards, category;

  if (roll < 0.25) {
    const rank = randomOf(RANKS);
    playerCards = [makeCard(rank), makeCard(rank)];
    category = "pair";
  } else if (roll < 0.5) {
    const kicker = randomOf(["2", "3", "4", "5", "6", "7", "8", "9"]);
    playerCards = [makeCard("A"), makeCard(kicker)];
    category = "soft";
  } else {
    const r1 = randomOf(RANKS.slice(0, 12)); // no aces in hard hands
    let r2 = randomOf(RANKS.slice(0, 12));
    while (cardValue(r2) === cardValue(r1)) r2 = randomOf(RANKS.slice(0, 12));
    playerCards = [makeCard(r1), makeCard(r2)];
    category = "hard";
  }

  return { playerCards, dealerCard: makeCard(randomOf(RANKS)), category };
}

function handLabel(scenario) {
  const { total, soft } = handValue(scenario.playerCards);
  if (scenario.category === "pair") {
    const r = scenario.playerCards[0].rank;
    return `pair of ${r}s`;
  }
  return soft ? `soft ${total}` : `hard ${total}`;
}

function dealerLabel(scenario) {
  const v = cardValue(scenario.dealerCard.rank);
  return v === 11 ? "A" : String(v);
}

// Distill the dealt cards into what the strategy table keys on.
function analyzeHand(scenario) {
  const { total, soft } = handValue(scenario.playerCards);
  const [c1, c2] = scenario.playerCards;
  const isPair = cardValue(c1.rank) === cardValue(c2.rank);
  return {
    isPair,
    pairValue: isPair ? cardValue(c1.rank) : null,
    total,
    soft,
    dealerValue: cardValue(scenario.dealerCard.rank),
  };
}

function cardEl(card) {
  const el = document.createElement("div");
  el.className = "card" + (RED_SUITS.has(card.suit) ? " red" : "");
  el.innerHTML = `
    <div class="corner">${card.rank}<br><span>${card.suit}</span></div>
    <div class="pip">${card.suit}</div>`;
  return el;
}

function cardBackEl() {
  const el = document.createElement("div");
  el.className = "card back";
  return el;
}

function render() {
  dealerCardsEl.replaceChildren(cardEl(current.dealerCard), cardBackEl());
  playerCardsEl.replaceChildren(...current.playerCards.map(cardEl));
  handValueEl.textContent = `(${handLabel(current)})`;
  splitBtn.disabled = current.category !== "pair";
}

function newHand() {
  current = dealScenario();
  awaitingChoice = true;
  feedbackEl.textContent = "What's the correct play?";
  feedbackEl.classList.remove("correct", "wrong");
  render();
}

function onAction(action) {
  if (!awaitingChoice) return;
  awaitingChoice = false;

  const best = bestAction(analyzeHand(current));
  const isCorrect = action === best;
  handsPlayed++;
  if (isCorrect) correctCount++;

  const pct = Math.round((correctCount / handsPlayed) * 100);
  statsEl.textContent = `Correct: ${correctCount}/${handsPlayed} (${pct}%)`;

  const where = `${handLabel(current)} vs ${dealerLabel(current)}`;
  feedbackEl.classList.remove("correct", "wrong");
  feedbackEl.classList.add(isCorrect ? "correct" : "wrong");
  feedbackEl.textContent = isCorrect
    ? `✓ ${ACTION_NAMES[best]} is right — ${where}.`
    : `✗ You chose ${ACTION_NAMES[action]} — correct is ${ACTION_NAMES[best]} (${where}).`;

  setTimeout(newHand, isCorrect ? 1100 : 2600);
}

for (const btn of document.querySelectorAll(".actions button")) {
  btn.addEventListener("click", () => onAction(btn.dataset.action));
}
document.getElementById("btn-next").addEventListener("click", newHand);

newHand();
