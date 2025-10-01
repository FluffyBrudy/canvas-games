import { Rank, Suit } from "../../constants";
import { CardModel } from "../card/model";

export class Deck {
  private cards: CardModel[] = [];

  constructor() {
    this.fullCards();
  }

  private fullCards() {
    const cards: CardModel[] = [];
    const allSuits: Suit[] = Object.values(Suit);
    const allRanks: Rank[] = Object.values(Rank).filter(
      (v): v is Rank => typeof v === "number"
    );

    for (const suit of allSuits) {
      for (const rank of allRanks) {
        cards.push(new CardModel(rank, suit));
      }
    }

    this.cards = cards;
    this.shuffle();
  }

  /**
   * This draw isn't ui drawing but pulling out cards
   */
  draw(): CardModel;
  draw(n: number): CardModel[];
  draw(n?: number): CardModel | CardModel[] {
    if (this.isEmpty()) throw new Error("Empty deck(BUG)");
    if (!n) {
      return this.cards.splice(0, 1)[0];
    } else {
      return this.cards.splice(0, n);
    }
  }

  isEmpty() {
    return this.cards.length == 0;
  }

  shuffle() {
    for (let i = this.cards.length - 1; i >= 0; i--) {
      const randIndex = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[randIndex]] = [
        this.cards[randIndex],
        this.cards[i],
      ];
    }
  }

  size() {
    return this.cards.length;
  }
}
