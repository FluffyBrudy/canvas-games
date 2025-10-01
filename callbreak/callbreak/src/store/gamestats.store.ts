import { SUBROUNDS } from "../constants";
import type { gameStats, GameStatsAttrs } from "../types/store.type";

export const gameStatsStore: gameStats = {
  round: [],
  currentRound: -1,

  initRound() {
    const newRound: GameStatsAttrs = {
      bids: {},
      winner: null,
      subroundWinner: [],
    };
    this.round.push(newRound);
    this.currentRound++;
  },

  addSubroundWinner(winner) {
    const r = this.round[this.currentRound];
    r.subroundWinner.push(winner);
  },

  isSubroundCompleted(): boolean {
    const r = this.round[this.currentRound];
    return r.subroundWinner.length >= SUBROUNDS;
  },

  isRoundCompleted(): boolean {
    const r = this.round[this.currentRound];
    return r.winner !== null;
  },

  nextRound() {
    if (!this.isRoundCompleted()) {
      throw new Error("Cannot advance: current round not complete yet.");
    }
    this.initRound();
  },
};
