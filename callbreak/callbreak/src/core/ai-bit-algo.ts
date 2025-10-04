import { Rank, Suit } from "../constants";
import type { CardModel } from "../entity/card/model";

const PT = {
  spade: {
    ACE: 1.0,
    KING: 0.8,
    QUEEN: 0.6,
    JACK: 0.4,
    TEN: 0.4,
    LOW: 0.2,
  },
  offsuit: {
    ACE: 0.8,
    KING: 0.6,
    QUEEN: 0.4,
    LOW: 0.0,
  },
  bonuses: {
    longSpade: 0.5,
    shortSuit: 0.3,
  },
};

export function calcBids(cards: CardModel[]) {
  let score = 0.0;

  for (const card of cards) {
    if (card.suit === Suit.SPADE) {
      if (card.rank === Rank.ACE) score += PT.spade.ACE;
      else if (card.rank === Rank.KING) score += PT.spade.KING;
      else if (card.rank === Rank.QUEEN) score += PT.spade.QUEEN;
      else if (card.rank === Rank.JACK) score += PT.spade.JACK;
      else if (card.rank === Rank.TEN) score += PT.spade.TEN;
      else score += PT.spade.LOW;
    } else {
      if (card.rank === Rank.ACE) score += PT.offsuit.ACE;
      else if (card.rank === Rank.KING) score += PT.offsuit.KING;
      else if (card.rank === Rank.QUEEN) score += PT.offsuit.QUEEN;
    }
  }

  const suitGroup: Record<Suit, CardModel[]> = {
    [Suit.SPADE]: [],
    [Suit.CLUB]: [],
    [Suit.DIAMOND]: [],
    [Suit.HEART]: [],
  };

  for (const card of cards) {
    suitGroup[card.suit].push(card);
  }

  if (suitGroup.spade.length >= 5) {
    score += PT.bonuses.longSpade;
  }

  for (const suit of [Suit.CLUB, Suit.DIAMOND, Suit.HEART]) {
    if (suitGroup[suit].length <= 2) {
      score += PT.bonuses.shortSuit;
    }
  }

  return Math.max(1, Math.floor(score));
}
