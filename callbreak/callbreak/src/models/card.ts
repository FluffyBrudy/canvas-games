import { Suit, type Rank } from "../constants";
import { ImageObj } from "../lib/image.lib";
import { Rect } from "../core/rect";
import { CustomEvent } from "../core/event";

export class Card {
  private rank: Rank;
  private suit: Suit;
  private image: HTMLImageElement;
  public rect: Rect;

  constructor(rank: Rank, suit: Suit, x: number, y: number, image: ImageObj) {
    this.rank = rank;
    this.suit = suit;
    this.image = image.image;
    this.rect = new Rect(x, y, this.image.width, this.image.height);
  }

  info() {
    return { rank: this.rank, suit: this.suit };
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.drawImage(this.image, this.rect.x, this.rect.y);

    ctx.font = ~~(this.rect.height * 0.2) + "px monospace";
    ctx.textBaseline = "middle";

    const fontWidth = ctx.measureText(this.rank.toString()).width;
    ctx.fillText(
      this.rank.toString(),
      this.rect.center.x - ~~(fontWidth / 2),
      this.rect.center.y
    );

    ctx.closePath();
  }

  update(eventStates?: ReturnType<CustomEvent["getState"]>) {
    if (eventStates) {
      const { leftPressed, mouseX, mouseY } = eventStates;
      if (this.rect.collidepoint(mouseX, mouseY)) {
        if (leftPressed) {
          console.log("clicked");
        }
      }
    }
  }
}
