import type { AIHandSprite, PlayerHandSprite } from "../entity/player/view";
import type { TBid, TPlayerLable } from "./types.type";

export interface GameStatsAttrs {
  bids: Record<TPlayerLable, TBid>;
  completedBids: Record<TPlayerLable, TBid>;
  winner: null | PlayerHandSprite | AIHandSprite;
  subroundWinner: TPlayerLable[];
}
export type BidEntity = { playerLabel: TPlayerLable; bid: TBid };

export interface gameStats {
  round: GameStatsAttrs[];
  currentRound: number;
  totalPlayers: number;
  initRound: () => void;
  addBid(playerId: string, bid: number): void;
  getBid: () => Record<TPlayerLable, TBid>;
  addSubroundWinner: (winner: TPlayerLable) => void;
  isBiddingComplete: () => boolean;
  isSubroundCompleted: () => boolean;
  isRoundCompleted: () => boolean;
  getHighestBid: () => BidEntity | null;
  nextRound: () => void;
  makeBidding: (label: TPlayerLable, bid: TBid) => void;
}
