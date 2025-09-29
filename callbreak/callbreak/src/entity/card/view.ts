import { Rect } from "../../core/rect";
import { SuitImages } from "../../systems/assets-loader";
import type { CardModel } from "./model";
import { Sprite } from "../../core/sprite";
import type { Coor } from "../../types/types.type";
import { destReached } from "../../utils/game-utils";
import { CardState } from "../../constants";

// this is  animatio duration used for linear interpolation
const t = 0.1;

export class CardSprite extends Sprite {
  image: HTMLImageElement;
  public rect: Rect;
  private model: CardModel;
  private angle: number;

  private translationCoor: Coor | null;
  private state: CardState = CardState.IDLE;

  private hoverOffset = 0;

  constructor(cardModel: CardModel, x: number, y: number, rotate = 0) {
    super();
    this.angle = rotate;
    this.model = cardModel;
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

  update() {}

  getModel() {
    return this.model;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.save();

    if (this.state === CardState.REVEALED) {
      this.hoverOffset = Math.min(
        this.hoverOffset + t * this.rect.width,
        this.rect.width
      );
    } else {
      this.hoverOffset = Math.max(this.hoverOffset - t * this.rect.width, 0);
    }

    ctx.translate(this.rect.center.x, this.rect.center.y);
    ctx.rotate(this.angle);
    ctx.drawImage(
      this.image,
      -this.rect.width / 2,
      -this.rect.height / 2 - this.hoverOffset,
      this.rect.width,
      this.rect.height
    );

    ctx.font = ~~(this.rect.height * 0.2) + "px monospace";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    const text = this.model.rank.toString();
    const fontWidth = ctx.measureText(text).width;

    ctx.fillText(text, ~~(-fontWidth / 2), -this.hoverOffset);
    ctx.restore();
    ctx.closePath();
  }

  animate() {
    if (this.translationCoor === null) return;

    this.rect.x = t * this.translationCoor.x + (1 - t) * this.rect.x;
    this.rect.y = t * this.translationCoor.y + (1 - t) * this.rect.y;

    if (this.state === CardState.DRAW) {
      this.rect.x = t * this.translationCoor.x + (1 - t) * this.rect.x;
      this.rect.y = t * this.translationCoor.y + (1 - t) * this.rect.y;
      if (destReached(this.rect.coordinate(), this.translationCoor)) {
        this.rect.x = this.translationCoor.x;
        this.rect.y = this.translationCoor.y;
        this.state = CardState.PLACED;
      }
    }
    if (this.state === CardState.COLLECTING) {
      this.rect.x = t * this.translationCoor.x + (1 - t) * this.rect.x;
      this.rect.y = t * this.translationCoor.y + (1 - t) * this.rect.y;

      if (destReached(this.rect.coordinate(), this.translationCoor)) {
        this.rect.x = this.translationCoor.x;
        this.rect.y = this.translationCoor.y;
        this.state = CardState.CLOSED;
      }
    }
    if (this.state === CardState.CLOSED) {
      this.kill();
    }
  }
}
