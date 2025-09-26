import { Suit, Rank, Precedence } from "../constants";
import { CardModel } from "../entity/card/model";

export function compareValue(src: Rank, dest: Rank): boolean {
  return src > dest;
}

export function compareSuit(
  src: Suit,
  target: Suit,
  leadingSuit: Suit
): Precedence {
  if (src === target) return Precedence.EQUAL;
  if (src === Suit.SPADE) return Precedence.HIGHER;
  if (target === Suit.SPADE) return Precedence.LOWER;
  if (src === leadingSuit) return Precedence.HIGHER;
  if (target === leadingSuit) return Precedence.LOWER;
  return Precedence.LOWER;
}

export function compareCard(
  src: CardModel,
  target: CardModel,
  leadingCard: CardModel
): boolean {
  const suitPrecedence = compareSuit(src.suit, target.suit, leadingCard.suit);
  if (suitPrecedence === Precedence.EQUAL) {
    return compareValue(src.rank, target.rank);
  }
  return suitPrecedence === Precedence.HIGHER;
}

export function chooseSubroundWinner(
  playerHands: Record<string, CardModel>,
  leadingCard: CardModel
): string {
  const entries = Object.entries(playerHands);
  let [winner, winningCard] = entries[0];

  for (const [player, CardModel] of entries.slice(1)) {
    if (compareCard(CardModel, winningCard, leadingCard)) {
      winner = player;
      winningCard = CardModel;
    }
  }

  return winner;
}
