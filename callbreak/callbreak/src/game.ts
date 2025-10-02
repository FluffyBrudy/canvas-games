import { CardState } from "./constants";
import { chooseSubroundWinner } from "./core/rule";
import type { CardModel } from "./entity/card/model";
import type { CardSprite } from "./entity/card/view";
import { Deck } from "./entity/deck/model";
import { AIHandSprite, PlayerHandSprite } from "./entity/player/view";
import { gameStatsStore } from "./store/gamestats.store";
import { anchors } from "./systems/alignments";
import type { EventDepSpriteKwargs } from "./types/types.type";
import { drawText } from "./utils/draw-utils";

export class Game {
  private players: (PlayerHandSprite | AIHandSprite)[];
  private labeledPlayers: Record<string, PlayerHandSprite | AIHandSprite> = {};
  private deck = new Deck();
  private turn = 0;
  private biddingTurn = 0;
  private biddingComplete = false;
  private roundCollected = false;
  private currentPlayer: PlayerHandSprite | AIHandSprite;
  private selectedCards: CardSprite[] = [];
  private gameStats: ReturnType<typeof gameStatsStore>;

  constructor(players: (PlayerHandSprite | AIHandSprite)[]) {
    this.players = players;
    this.gameStats = gameStatsStore(this.players.length);

    this.gameStats.initRound();
    this.dealDeck();
    this.labelPlayers();

    this.currentPlayer = this.players[this.turn];
  }

  private labelPlayers() {
    for (let player of this.players) {
      this.labeledPlayers[player.getLable()] = player;
    }
  }

  private handleAI() {
    if (
      this.currentPlayer instanceof AIHandSprite &&
      !this.currentPlayer.selectedCard
    ) {
      this.currentPlayer.revealCard(
        this.selectedCards[0]?.getModel(),
        this.selectedCards.map((c) => c.getModel())
      );
    }
  }

  private updateCurrentPlayer(kwargs?: EventDepSpriteKwargs) {
    this.currentPlayer.update({
      ...kwargs,
      leadingCard: this.selectedCards[0]?.getModel(),
    });
  }

  private handleTurnRotation() {
    const selectedCard = this.currentPlayer.selectedCard;
    if (this.currentPlayer.isPlaced() && selectedCard) {
      this.selectedCards.push(selectedCard);
      this.turn = (this.turn + 1) % this.players.length;
      this.currentPlayer = this.players[this.turn];
    }
  }
  private collectRoundIfNeeded() {
    if (
      this.selectedCards.length !== this.players.length ||
      this.roundCollected
    )
      return;

    const roundCollectedCards: Record<string, CardModel> = {};
    for (let player of this.players) {
      if (player.selectedCard) {
        roundCollectedCards[player.getLable()] = player.selectedCard.getModel();
      }
    }

    const winner = chooseSubroundWinner(
      roundCollectedCards,
      this.selectedCards[0].getModel()
    );
    this.roundCollected = true;

    for (let player of this.players) {
      player.collectSelectedCard(this.labeledPlayers[winner].rect.center);
    }

    this.gameStats.addSubroundWinner(winner);
  }

  private cleanupClosedCards() {
    if (this.selectedCards.length === 0) return;
    if (this.selectedCards.every((c) => c.getState() === CardState.CLOSED)) {
      this.emptyTable();
    }
  }

  private animatePlayers() {
    for (let player of this.players) {
      player.animate();
    }
  }

  private handleBidding() {
    if (this.biddingComplete) return;

    const current = this.players[this.biddingTurn];

    if (current instanceof AIHandSprite) {
      const randomBid = Math.floor(Math.random() * 13) + 1;
      this.gameStats.addBid(current.getLable(), randomBid);
      this.advanceBiddingTurn();
    }
  }

  getCurrentBiddingPlayer() {
    return this.isBiddingComplete() ? null : this.players[this.biddingTurn];
  }

  addBid(label: string, bid: number) {
    this.gameStats.addBid(label, bid);
  }

  advanceBiddingTurn() {
    this.biddingTurn++;
  }

  dealDeck() {
    while (!this.deck.isEmpty()) {
      for (let player of this.players) {
        const card = this.deck.draw();
        player.addCard(card);
      }
    }
  }

  isBiddingComplete() {
    return this.gameStats.isBiddingComplete();
  }

  emptyTable() {
    this.selectedCards = [];
    this.roundCollected = false;
    for (let player of this.players) player.clearCard();
  }

  update(_now: number, kwargs?: EventDepSpriteKwargs) {
    if (!this.isBiddingComplete()) {
      this.handleBidding();
      return;
    }

    if (this.gameStats.isSubroundCompleted()) {
      return;
    }
    this.handleAI();
    this.updateCurrentPlayer(kwargs);
    this.handleTurnRotation();
    this.collectRoundIfNeeded();
    this.cleanupClosedCards();
    this.animatePlayers();
  }

  drawBidding(ctx: CanvasRenderingContext2D) {
    const bids = Object.entries(this.gameStats.getBid());

    for (const [playerLabel, bid] of bids) {
      const text = `${playerLabel}: ${bid}`;
      const player = this.labeledPlayers[playerLabel];
      const alignment = player.alignment.name;
      const { x, y } = player.rect[alignment];
      drawText(ctx, text, x, y, ...anchors[alignment]);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.drawBidding(ctx);
    for (let player of this.players) {
      player.draw(ctx);
    }
  }
}
