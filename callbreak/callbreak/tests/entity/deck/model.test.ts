import { describe, it, expect, vi } from "vitest";

import { Deck } from "../../../src/entity/deck/model";
import { CardModel } from "../../../src/entity/card/model";
import { Rank, Suit } from "../../../src/constants";

describe("Deck", () => {
  it("testSingleDrawReturnsCardAndReducesSizeByOne", () => {
    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.5);

    const deck = new Deck();
    const initialSize = deck.size();

    const card = deck.draw();

    expect(card).toBeInstanceOf(CardModel);
    expect(deck.size()).toBe(initialSize - 1);

    randomSpy.mockRestore();
  });

  it("testDeckInitializesWith52UniqueCards", () => {
    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.5);

    const deck = new Deck();
    expect(deck.size()).toBe(52);

    const seen = new Set<string>();
    for (let i = 0; i < 52; i++) {
      const card = deck.draw();
      const { rank, suit } = card.info();
      seen.add(`${rank}-${suit}`);
    }
    expect(seen.size).toBe(52);

    const expected = new Set<string>();
    for (const suit of Object.values(Suit).filter(
      (v) => typeof v === "string"
    )) {
      for (const rank of Object.values(Rank).filter(
        (v) => typeof v === "number"
      )) {
        expected.add(`${rank}-${suit}`);
      }
    }
    expect(seen).toEqual(expected);

    randomSpy.mockRestore();
  });

  it("testDrawNReturnsNAndReducesDeckSize", () => {
    const deck = new Deck();
    const initialSize = deck.size();

    const n = 5;
    const cards = deck.draw(n);

    expect(Array.isArray(cards)).toBe(true);
    expect(cards.length).toBe(n);
    cards.forEach((c) => expect(c).toBeInstanceOf(CardModel));
    expect(deck.size()).toBe(initialSize - n);
  });

  it("testShufflePreservesCardSetAndSize", () => {
    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.25);

    const deck = new Deck();
    expect(deck.size()).toBe(52);

    deck.shuffle();
    expect(deck.size()).toBe(52);

    const cards = deck.draw(52);
    expect(cards.length).toBe(52);

    const seen = new Set<string>();
    for (const c of cards) {
      const { rank, suit } = c.info();
      seen.add(`${rank}-${suit}`);
    }
    expect(seen.size).toBe(52);

    const expected = new Set<string>();
    for (const suit of Object.values(Suit).filter(
      (v) => typeof v === "string"
    )) {
      for (const rank of Object.values(Rank).filter(
        (v) => typeof v === "number"
      )) {
        expected.add(`${rank}-${suit}`);
      }
    }
    expect(seen).toEqual(expected);

    randomSpy.mockRestore();
  });

  it("testDrawOnEmptyDeckThrowsError", () => {
    const deck = new Deck();
    deck.draw(52);
    expect(deck.size()).toBe(0);

    expect(() => deck.draw()).toThrowError("Empty deck(BUG)");
  });

  it("testDrawMoreThanAvailableReturnsRemainingAndEmpties", () => {
    const deck = new Deck();

    const cards = deck.draw(60);
    expect(Array.isArray(cards)).toBe(true);
    expect(cards.length).toBe(52);
    cards.forEach((c) => expect(c).toBeInstanceOf(CardModel));

    expect(deck.size()).toBe(0);
  });

  it("testDrawZeroReturnsSingleCardDueToFalsyCheck", () => {
    const deck = new Deck();
    const initialSize = deck.size();

    const result = deck.draw(0 as any);
    expect(result).toBeInstanceOf(CardModel);
    expect(deck.size()).toBe(initialSize - 1);
  });

  it("testDrawNegativeNReturnsEmptyArrayAndKeepsSize", () => {
    const deck = new Deck();
    const initialSize = deck.size();

    const result = deck.draw(-3);
    expect(Array.isArray(result)).toBe(true);
    expect((result as CardModel[]).length).toBe(0);
    expect(deck.size()).toBe(initialSize);
  });
});
