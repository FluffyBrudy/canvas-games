import { Rect } from "../../core/rect";
import { SuitImages } from "../../systems/assets-loader";
import type { CardModel } from "./model";
import { Sprite } from "../../core/sprite";
import type { Coor } from "../../types/types.type";
import { destReached } from "../../utils/game-utils";
import { CardState } from "../../constants";

const t = 0.1;

export class CardSprite extends Sprite {
  image: HTMLImageElement;
  public rect: Rect;
  private model: CardModel;
  private angle: number;

  private translationCoor: Coor | null;
  private state: CardState = CardState.IDLE;
  private hoverOffset = 0;

  private defaultHidden: boolean;

  constructor(
    cardModel: CardModel,
    x: number,
    y: number,
    rotate = 0,
    defaultHidden = false
  ) {
    super();
    this.angle = rotate;
    this.model = cardModel;
    this.defaultHidden = defaultHidden;
    this.image = SuitImages[cardModel.suit].image;
    this.rect = new Rect(x, y, this.image.width, this.image.height);
    this.translationCoor = { x, y };
  }

  public setState(state: CardState, coor?: Coor) {
    this.state = state;
    if (coor) this.translationCoor = coor;
  }

  public getState() {
    return this.state;
  }

  getModel() {
    return this.model;
  }

  update() {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.rect.center.x, this.rect.center.y);
    ctx.rotate(this.angle);

    const isVisible = !this.defaultHidden || this.state !== CardState.IDLE;

    if (this.state === CardState.REVEALED) {
      this.hoverOffset = Math.min(
        this.hoverOffset + t * this.rect.width,
        this.rect.width * 0.15
      );
    } else {
      this.hoverOffset = Math.max(this.hoverOffset - t * this.rect.width, 0);
    }

    const cardX = -this.rect.width / 2;
    const cardY = -this.rect.height / 2 - this.hoverOffset;

    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 6;

    if (isVisible) {
      const bgGradient = ctx.createLinearGradient(
        cardX,
        cardY,
        cardX,
        cardY + this.rect.height
      );
      bgGradient.addColorStop(0, "#f9fafb");
      bgGradient.addColorStop(1, "#e5e7eb");

      ctx.fillStyle = bgGradient;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, this.rect.width, this.rect.height, 8);
      ctx.fill();

      ctx.shadowColor = "transparent";

      if (this.image.complete && this.image.naturalWidth > 0) {
        ctx.drawImage(
          this.image,
          cardX,
          cardY,
          this.rect.width,
          this.rect.height
        );
      }

      ctx.lineWidth = this.state === CardState.REVEALED ? 4 : 2;
      ctx.strokeStyle =
        this.state === CardState.REVEALED ? "#fbbf24" : "#9ca3af";
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, this.rect.width, this.rect.height, 8);
      ctx.stroke();

      const text = this.model.rank.toString();
      ctx.font = `bold ${~~(this.rect.height * 0.25)}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = 4;
      ctx.strokeStyle = "white";
      ctx.fillStyle = "black";
      ctx.strokeText(text, 0, -this.hoverOffset);
      ctx.fillText(text, 0, -this.hoverOffset);
    } else {
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, this.rect.width, this.rect.height, 8);
      const backGradient = ctx.createLinearGradient(
        cardX,
        cardY,
        cardX + this.rect.width,
        cardY + this.rect.height
      );
      backGradient.addColorStop(0, "#1e3a8a");
      backGradient.addColorStop(0.5, "#3b82f6");
      backGradient.addColorStop(1, "#1e3a8a");
      ctx.fillStyle = backGradient;
      ctx.fill();

      ctx.shadowColor = "transparent";
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#60a5fa";
      for (let i = cardX + 10; i < cardX + this.rect.width - 10; i += 12) {
        ctx.beginPath();
        ctx.moveTo(i, cardY + 10);
        ctx.lineTo(i, cardY + this.rect.height - 10);
        ctx.stroke();
      }

      ctx.lineWidth = 3;
      ctx.strokeStyle = "#1e40af";
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, this.rect.width, this.rect.height, 8);
      ctx.stroke();
    }

    ctx.restore();
  }

  animate() {
    if (this.translationCoor === null) return;

    this.rect.x = t * this.translationCoor.x + (1 - t) * this.rect.x;
    this.rect.y = t * this.translationCoor.y + (1 - t) * this.rect.y;

    if (this.state === CardState.DRAW) {
      if (destReached(this.rect.coordinate(), this.translationCoor)) {
        this.rect.x = this.translationCoor.x;
        this.rect.y = this.translationCoor.y;
        this.state = CardState.PLACED;
      }
    }

    if (this.state === CardState.COLLECTING) {
      if (destReached(this.rect.coordinate(), this.translationCoor)) {
        this.rect.x = this.translationCoor.x;
        this.rect.y = this.translationCoor.y;
        this.state = CardState.CLOSED;
      }
    }
  }

  getAdjustedCoor() {
    return new Rect(
      this.rect.x,
      this.rect.y - this.hoverOffset,
      this.rect.width,
      this.rect.height
    );
  }
}
