import type { TBid, TPlayerLable } from "./types.type";

export interface GameStatsAttrs {
  bids: Record<TPlayerLable, TBid>;
  completedBids: Record<TPlayerLable, TBid>;
  subroundWinner: TPlayerLable[];
}
export type BidEntity = { playerLabel: TPlayerLable; bid: TBid };

export interface gameStats {
  maxRounds: number;
  round: GameStatsAttrs[];
  currentRound: number;
  totalPlayers: number;
  initRound: () => void;
  addBid(playerId: string, bid: number): void;
  getBid: () => {
    bids: Record<TPlayerLable, TBid>;
    completedBids: Record<TPlayerLable, TBid>;
  };
  addSubroundWinner: (winner: TPlayerLable) => void;
  isBiddingComplete: () => boolean;
  isSubroundCompleted: () => boolean;
  getHighestBid: () => BidEntity | null;
  makeBidding: (label: TPlayerLable, bid: TBid) => void;
  calculateRoundResult: (round?: number) => {
    totals: Record<TPlayerLable, TBid>;
    winner: string | null;
  };
}
