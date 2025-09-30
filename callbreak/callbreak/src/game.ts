import { CardState } from "./constants";
import { chooseSubroundWinner } from "./core/rule";
import type { CardModel } from "./entity/card/model";
import type { CardSprite } from "./entity/card/view";
import { Deck } from "./entity/deck/model";
import { AIHandSprite, PlayerHandSprite } from "./entity/player/view";
import type { EventDepSpriteKwargs } from "./types/types.type";

export class Game {
  private players: (PlayerHandSprite | AIHandSprite)[];
  private labeledPlayers: Record<string, PlayerHandSprite | AIHandSprite> = {};
  private deck = new Deck();
  private turn = 0;
  private roundCollected = false;
  private currentPlayer: PlayerHandSprite | AIHandSprite;
  /*
   * four selected cards
   */
  private selectedCards: CardSprite[] = [];

  constructor(players: (PlayerHandSprite | AIHandSprite)[]) {
    this.players = players;

    this.dealDeck();
    this.labelPlayers();

    this.currentPlayer = this.players[this.turn];
  }

  dealDeck() {
    while (!this.deck.isEmpty()) {
      for (let player of this.players) {
        const card = this.deck.draw();
        player.addCard(card);
      }
    }
  }

  private labelPlayers() {
    for (let player of this.players) {
      this.labeledPlayers[player.getLable()] = player;
    }
  }

  emptyTable() {
    this.selectedCards = [];
    this.roundCollected = false;
    for (let player of this.players) player.clearCard();
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

  update(kwargs?: EventDepSpriteKwargs) {
    this.handleAI();
    this.updateCurrentPlayer(kwargs);
    this.handleTurnRotation();
    this.collectRoundIfNeeded();
    this.cleanupClosedCards();
    this.animatePlayers();
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let player of this.players) {
      player.draw(ctx);
    }
  }
}
