import { SUBROUNDS } from "../constants";
import type { gameStats, GameStatsAttrs } from "../types/store.type";
import type { TBid, TPlayerLable } from "../types/types.type";

export const gameStatsStore: (
  playerCount: number,
  maxRounds: number
) => gameStats = (playersCount: number, maxRounds: number) => ({
  round: [],
  maxRounds: maxRounds,
  currentRound: -1,
  totalPlayers: playersCount,

  initRound() {
    const newRound: GameStatsAttrs = {
      bids: {},
      completedBids: {},
      subroundWinner: [],
    };
    this.round.push(newRound);
    this.currentRound++;
  },

  addSubroundWinner(winner) {
    const r = this.round[this.currentRound];
    r.subroundWinner.push(winner);
    if (!(winner in r.completedBids)) {
      r.completedBids[winner] = 0;
    }
    r.completedBids[winner]++;
  },

  isSubroundCompleted(): boolean {
    const r = this.round[this.currentRound];
    return r.subroundWinner.length >= SUBROUNDS;
  },

  addBid(playerLabel: string, bid: number) {
    const r = this.round[this.currentRound];
    r.bids[playerLabel] = bid;
  },

  getBid() {
    const { bids, completedBids } = this.round[this.currentRound];
    return { bids, completedBids };
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

  calculateRoundResult(roundIndex?: number) {
    const round = roundIndex ?? this.round.length - 1;
    if (round < 0 || round >= this.round.length)
      throw Error("round out of bound");

    const totals = {} as Record<TPlayerLable, TBid>;

    for (let ri = 0; ri <= round; ri++) {
      const { bids, completedBids } = this.round[ri];
      for (let playerLabel of Object.keys(bids) as TPlayerLable[]) {
        const targetBid = bids[playerLabel];
        const madeBid = completedBids[playerLabel] ?? 0;
        const bidDist = madeBid - targetBid;

        if (!(playerLabel in totals)) {
          totals[playerLabel] = 0;
        }

        if (bidDist >= 0) {
          totals[playerLabel] += targetBid + bidDist * 0.1;
        } else {
          totals[playerLabel] += madeBid - targetBid;
        }
      }
    }

    let winner: TPlayerLable | null = null;
    let maxBid = -Infinity;
    for (const [playerLabel, totalBids] of Object.entries(totals)) {
      if (totalBids > maxBid) {
        winner = playerLabel as TPlayerLable;
        maxBid = totalBids;
      }
    }

    return { totals, winner };
  },
});
