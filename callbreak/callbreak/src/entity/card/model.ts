import type { Rank, Suit } from "../../constants";

export class CardModel {
  public readonly rank: Rank;
  public readonly suit: Suit;

  constructor(rank: Rank, suit: Suit) {
    this.rank = rank;
    this.suit = suit;
  }

  info() {
    return { rank: this.rank, suit: this.suit };
  }
}
