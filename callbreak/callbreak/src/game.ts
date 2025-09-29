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
    while (!this.deck.isEmpty()) {
      for (let player of this.players) {
        const card = this.deck.draw();
        player.addCard(card);
      }
    }
    this.currentPlayer = this.players[this.turn];
    for (let player of this.players) {
      this.labeledPlayers[player.getLable()] = player;
    }
  }

  emptyTable() {
    this.selectedCards = [];
    this.roundCollected = false;
    for (let player of this.players) player.selectedCard = null;
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let player of this.players) {
      if (player instanceof PlayerHandSprite && player === this.currentPlayer) {
        player.drawRevealableCard(ctx, this.selectedCards[0]?.getModel());
      } else {
        player.draw(ctx);
      }
    }
  }

  update(kwargs?: EventDepSpriteKwargs) {
    if (
      this.currentPlayer instanceof AIHandSprite &&
      !this.currentPlayer.selectedCard
    ) {
      this.currentPlayer.revealCard(
        this.selectedCards[0]?.getModel(),
        this.selectedCards.map((c) => c.getModel())
      );
    }

    this.currentPlayer.update({
      ...kwargs,
      leadingCard: this.selectedCards[0]?.getModel(),
    });

    const selectedCard = this.currentPlayer.selectedCard;
    if (this.currentPlayer.isPlaced() && selectedCard) {
      this.selectedCards.push(selectedCard);

      this.turn = (this.turn + 1) % this.players.length;
      this.currentPlayer = this.players[this.turn];
    }

    if (
      this.selectedCards.length === this.players.length &&
      !this.roundCollected
    ) {
      const roundCollectedCards: Record<string, CardModel> = {};

      for (let player of this.players) {
        /* REMAINDER: guard just to make ts happy */
        if (player.selectedCard) {
          roundCollectedCards[player.getLable()] =
            player.selectedCard.getModel();
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

    if (
      this.selectedCards.length > 0 &&
      this.selectedCards.every((c) => c.getState() === CardState.CLOSED)
    ) {
      this.emptyTable();
    }

    for (let player of this.players) {
      player.animate();
    }
  }
}
