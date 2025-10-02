import { SUBROUNDS } from "../constants";
import type { gameStats, GameStatsAttrs } from "../types/store.type";

export const gameStatsStore: (playerCount: number) => gameStats = (
  playersCount: number
) => ({
  round: [],
  currentRound: -1,
  totalPlayers: playersCount,

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

  addBid(playerLabel: string, bid: number) {
    const r = this.round[this.currentRound];
    r.bids[playerLabel] = bid;
  },

  getBid() {
    return this.round[this.currentRound].bids;
  },

  isBiddingComplete(): boolean {
    const r = this.round[this.currentRound];
    return Object.keys(r.bids).length === this.totalPlayers;
  },

  makeBidding(label, bid) {
    if (bid < 1 || bid > 13) new Error("invalid bid selection");
    this.round[this.currentRound].bids[label] = bid;
  },

  getHighestBid(): { playerLabel: string; bid: number } | null {
    const r = this.round[this.currentRound];
    let max = -Infinity,
      winner = null;
    for (const [pid, bid] of Object.entries(r.bids)) {
      if (bid > max) {
        max = bid;
        winner = pid;
      }
    }
    return winner ? { playerLabel: winner, bid: max } : null;
  },
});
