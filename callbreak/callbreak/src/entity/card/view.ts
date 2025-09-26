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
    return this.model.info();
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.drawImage(this.image, this.rect.x, this.rect.y);

    ctx.font = ~~(this.rect.height * 0.2) + "px monospace";
    ctx.textBaseline = "middle";

    const fontWidth = ctx.measureText(this.model.rank.toString()).width;
    ctx.fillText(
      this.model.rank.toString(),
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
