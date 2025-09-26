import type { CustomEvent } from "../../core/event";
import { AIHandSprite, PlayerHandSprite } from "../player/view";

export class Table {
  private humanPlayer: PlayerHandSprite[] = [];
  private aiPlayer: AIHandSprite[] = [];

  constructor(playersCount = 2) {
    if (playersCount < 2 || playersCount > 4)
      throw new Error("require 2 to 4 players");
  }

  add(player: AIHandSprite | PlayerHandSprite) {
    if (player instanceof PlayerHandSprite) {
      this.humanPlayer.push(player);
    } else if (player instanceof AIHandSprite) {
      this.aiPlayer.push(player);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const players = [...this.humanPlayer, ...this.aiPlayer];
    for (let player of players) {
      player.draw(ctx);
    }
  }

  update(event: ReturnType<CustomEvent["getState"]>) {
    for (let player of this.humanPlayer) {
      player.update(event);
    }
    for (let ai of this.aiPlayer) {
      ai.update();
    }
  }
}
