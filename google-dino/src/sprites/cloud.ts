import cloudImage from "../assets/graphics/environment/cloud.png";
import { randfloat } from "../utils/math.utils";

export class Cloud {
  private image: HTMLImageElement;
  private x: number;
  private y: number;
  private readonly size: { w: number; h: number };

  constructor(x: number, y: number, image: HTMLImageElement) {
    this.image = image;
    this.image.src = cloudImage;
    this.x = x;
    this.y = y;
    const scaleFactor = randfloat(0.5, 0.7);
    this.size = Object.freeze({
      w: scaleFactor * this.image.width,
      h: scaleFactor * this.image.height,
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image, this.x, this.y, this.size.w, this.size.h);
  }

  isBeyondLeftEdge() {
    return this.x < -this.size.w;
  }

  isInView(rightEdge: number, leftEdge?: number) {
    return this.x >= (leftEdge || -this.size.w) && this.x <= rightEdge;
  }

  update(delta: number, playerSpeed: number) {
    this.x -= playerSpeed * delta * 0.4;
  }
}
