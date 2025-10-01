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
  initRound: () => void;
  addSubroundWinner: (winner: TPlayerLable) => void;
  isSubroundCompleted: () => boolean;
  isRoundCompleted: () => boolean;
  nextRound: () => void;
}
