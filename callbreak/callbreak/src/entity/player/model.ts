import { Rank, Suit } from "../../constants";
import { CardModel } from "../card/model";
import { compareCard } from "../../core/rule";

// TODO: debug only
function formatHand(cards: CardModel[]): string {
  return cards.map((c, i) => `${i + 1}: ${c.rank}-${c.suit}`).join("  ");
}

export class Hand {
  private static count = 0;
  public label: string;
  public isHuman: boolean;
  public cards: CardModel[];

  constructor(isHuman = false, label?: string) {
    this.label = label ?? `player${Hand.count}`;
    this.isHuman = isHuman;
    this.cards = [];
    Hand.count += 1;
  }

  add(card: CardModel) {
    this.cards.push(card);
  }

  reveal(model: CardModel): CardModel {
    return this.cards.splice(this.getIndex(model), 1)[0];
  }

  private getIndex(model: CardModel) {
    return this.cards.indexOf(model);
  }

  chooseRevealableCards(leadingCard?: CardModel): CardModel[] {
    if (!leadingCard) {
      return this.cards.map((card) => card);
    }

    const sameSuits = this.cards
      .map((card) => card)
      .filter((card) => card.suit === leadingCard.suit);

    if (sameSuits.length > 0) return sameSuits;

    const spades = this.cards
      .map((card) => card)
      .filter((card) => card.suit === Suit.SPADE);

    if (spades.length > 0) return spades;

    return this.cards.map((card) => card);
  }

  toString(): string {
    return formatHand(this.cards);
  }
}

export class AIHand extends Hand {
  constructor(label?: string) {
    super(false, label);
  }

  chooseRevealCard(
    leadingCard?: CardModel,
    otherCards: Iterable<CardModel> = []
  ): CardModel {
    let card: CardModel | undefined;

    if (!leadingCard) {
      const sorted = [...this.cards].sort((a, b) => a.rank - b.rank);
      card = this.omitAceIfPossible(sorted);
      return this.reveal(card);
    }

    const sameSuits = this.cards.filter((c) => c.suit === leadingCard.suit);
    const otherSuits = this.cards.filter((c) => c.suit !== leadingCard.suit);

    if (sameSuits.length > 0) {
      card = this.decide(sameSuits, leadingCard, otherCards);
    } else if (otherSuits.length > 0) {
      card = this.decide(otherSuits, leadingCard, otherCards);
    }

    if (!card) {
      const sorted = [...this.cards].sort((a, b) => a.rank - b.rank);
      card = this.omitAceIfPossible(sorted);
    }

    return this.reveal(card);
  }

  private decide(
    cards: CardModel[],
    leadingCard: CardModel,
    otherCards: Iterable<CardModel>
  ): CardModel | undefined {
    const choices: CardModel[] = [];

    for (const card of cards) {
      for (const otherCard of otherCards) {
        if (compareCard(card, otherCard, leadingCard)) {
          choices.push(card);
        }
      }
    }

    if (choices.length > 0) {
      choices.sort((a, b) => a.rank - b.rank);
      return this.omitAceIfPossible(choices);
    }

    return undefined;
  }

  private omitAceIfPossible(sortedCards: CardModel[]): CardModel {
    if (sortedCards[0].rank === Rank.ACE && sortedCards.length > 1) {
      return sortedCards[1];
    }
    return sortedCards[0];
  }
}
