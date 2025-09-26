import { Rank, Suit } from "../../constants";
import { CardModel } from "../card/model";

export class Deck {
  private cards: CardModel[];

  constructor() {
    this.cards = this.fullCards();
    this.shuffle();
  }

  private fullCards() {
    const cards: CardModel[] = [];
    for (let suit of Object.values(Suit)) {
      for (let rank of Object.values(Rank)) {
        const r = rank as number;
        cards.push(new CardModel(r, suit));
      }
    }
    return cards;
  }

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
    for (let i = this.cards.length - 1; i <= 0; i--) {
      const randIndex = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[randIndex]] = [
        this.cards[randIndex],
        this.cards[i],
      ];
    }
  }
}
