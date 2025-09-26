import { Rect } from "../../core/rect";
import { CustomEvent } from "../../core/event";
import { SuitImages } from "../../systems/assets-loader";
import type { CardModel } from "./model";

export class CardSprite {
  private image: HTMLImageElement;
  private model: CardModel;
  public rect: Rect;

  constructor(cardModel: CardModel, x: number, y: number) {
    this.model = cardModel;
    this.image = SuitImages[cardModel.suit].image;
    this.rect = new Rect(x, y, this.image.width, this.image.height);
  }

  info() {
    return this.model;
  }

  draw(ctx: CanvasRenderingContext2D, isHighlighted = false) {
    ctx.save();
    ctx.beginPath();

    if (isHighlighted) {
      ctx.strokeStyle = "gold";
      ctx.lineWidth = 5;
      ctx.shadowColor = "rgba(255, 215, 0, 0.8)";
      ctx.shadowBlur = 15;
      ctx.strokeRect(
        this.rect.x,
        this.rect.y,
        this.rect.width,
        this.rect.height
      );
      // ctx.shadowBlur = 0;
    }
    ctx.drawImage(this.image, this.rect.x, this.rect.y);

    ctx.font = ~~(this.rect.height * 0.2) + "px monospace";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";

    const fontWidth = ctx.measureText(this.model.rank.toString()).width;
    ctx.fillText(
      this.model.rank.toString(),
      this.rect.center.x - ~~(fontWidth / 2),
      this.rect.center.y
    );

    ctx.closePath();
    ctx.restore();
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
