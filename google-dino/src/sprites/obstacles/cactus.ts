import { BaseObstacle } from "./base";

export class Cactus extends BaseObstacle {
  private image: HTMLImageElement;
  private type: "largeDouble";

  constructor(
    x: number,
    y: number,
    image: HTMLImageElement,
    type?: "largeDouble"
  ) {
    super(x, y);

    this.type = type || "largeDouble";
    this.image = image;
    this.size = { w: this.image.width * 0.4, h: this.image.height * 0.4 };

    this.x = x;
    this.y = y - this.size.h;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image, this.x, this.y, this.size.w, this.size.h);
  }

  update(delta: number, playerSpeed: number) {
    this.x -= playerSpeed * delta;
  }

  getType() {
    return this.type;
  }
}
