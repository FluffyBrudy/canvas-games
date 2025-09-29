export enum Suit {
  SPADE = "spade",
  CLUB = "club",
  HEART = "heart",
  DIAMOND = "diamond",
}

export enum Rank {
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
  EIGHT = 8,
  NINE = 9,
  TEN = 10,
  JACK = 11,
  QUEEN = 12,
  KING = 13,
  ACE = 14,
}

export enum Precedence {
  HIGHER = 1,
  EQUAL = 0,
  LOWER = -1,
}

export const RANKLEN = ~~(Object.keys(Rank).length / 2);

export enum CardState {
  IDLE,
  REVEALED,
  DRAW,
  PLACED,
  COLLECTING,
  CLOSED,
}
