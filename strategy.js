"use strict";

// Basic strategy lookup — classic rules: 4-8 decks, dealer STANDS on
// soft 17 (S17), double after split allowed (DAS), late surrender.
//
// Hands here are always the first two cards, so D means "double" outright
// and R means "surrender" outright (their fallback cases can't arise).
//
// Each row string holds the dealer columns in order: 2 3 4 5 6 7 8 9 10 A

const HARD_TABLE = {
  5:  "HHHHHHHHHH",
  6:  "HHHHHHHHHH",
  7:  "HHHHHHHHHH",
  8:  "HHHHHHHHHH",
  9:  "HDDDDHHHHH",
  10: "DDDDDDDDHH",
  11: "DDDDDDDDDH",
  12: "HHSSSHHHHH",
  13: "SSSSSHHHHH",
  14: "SSSSSHHHHH",
  15: "SSSSSHHHRH",
  16: "SSSSSHHRRR",
  17: "SSSSSSSSSS",
};

const SOFT_TABLE = {
  13: "HHHDDHHHHH",
  14: "HHHDDHHHHH",
  15: "HHDDDHHHHH",
  16: "HHDDDHHHHH",
  17: "HDDDDHHHHH",
  18: "SDDDDSSHHH",
  19: "SSSSSSSSSS",
  20: "SSSSSSSSSS",
};

// Keyed by the value of ONE card of the pair (A = 11).
const PAIR_TABLE = {
  2:  "PPPPPPHHHH",
  3:  "PPPPPPHHHH",
  4:  "HHHPPHHHHH",
  5:  "DDDDDDDDHH",
  6:  "PPPPPHHHHH",
  7:  "PPPPPPHHHH",
  8:  "PPPPPPPPPP",
  9:  "PPPPPSPPSS",
  10: "SSSSSSSSSS",
  11: "PPPPPPPPPP",
};

function dealerIndex(dealerValue) {
  return dealerValue === 11 ? 9 : dealerValue - 2;
}

// hand: { isPair, pairValue, total, soft, dealerValue }
// Returns one of "H" | "S" | "D" | "P" | "R".
function bestAction(hand) {
  const col = dealerIndex(hand.dealerValue);
  if (hand.isPair) return PAIR_TABLE[hand.pairValue][col];
  if (hand.soft) return SOFT_TABLE[Math.min(Math.max(hand.total, 13), 20)][col];
  if (hand.total >= 17) return "S";
  return HARD_TABLE[Math.max(hand.total, 5)][col];
}
