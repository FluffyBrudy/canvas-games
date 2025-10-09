import { Rect, Sprite } from "canvas-utils-lib";
export class Card extends Sprite {
  public rect: Rect;
  public color = "#FFFFFF";
  public angle = 0;

  constructor(rect: Rect, color?: string, angle?: number) {
    super();
    this.rect = rect;
    this.color = color || this.color;
    this.angle = angle || this.angle;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    ctx.translate(this.rect.midbottom.x, this.rect.midbottom.y);
    ctx.rotate(this.angle);

    ctx.fillStyle = this.color;
    ctx.fillRect(
      -this.rect.width / 2,
      -this.rect.height,
      this.rect.width,
      this.rect.height
    );

    ctx.restore();
  }

  update(_?: Record<string, any>): void {}
}
