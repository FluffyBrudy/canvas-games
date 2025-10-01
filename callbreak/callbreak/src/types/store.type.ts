import type { AIHandSprite, PlayerHandSprite } from "../entity/player/view";
import type { TBid, TPlayerLable } from "./types.type";

export interface GameStatsAttrs {
  bids: Record<TPlayerLable, TBid>;
  winner: null | PlayerHandSprite | AIHandSprite;
  subroundWinner: TPlayerLable[];
}

export interface gameStats {
  round: GameStatsAttrs[];
  currentRound: number;
  totalPlayers: number;
  initRound: () => void;
  addBid(playerId: string, bid: number): void;
  addSubroundWinner: (winner: TPlayerLable) => void;
  isBiddingComplete: () => boolean;
  isSubroundCompleted: () => boolean;
  isRoundCompleted: () => boolean;
  getHighestBid: () => { playerLabel: TPlayerLable; bid: TBid } | null;
  nextRound: () => void;
  makeBidding: (label: TPlayerLable, bid: TBid) => void;
}
