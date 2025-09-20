import cloudImage from "../assets/graphics/environment/cloud.png";
import { DEFAULT_WORLD_SHIFT } from "../constants";
import { randfloat } from "../utils/math.utils";

export class Cloud {
  private image: HTMLImageElement;
  private x: number;
  private y: number;
  private speed: number;
  private readonly size: { w: number; h: number };

  constructor(x: number, y: number) {
    this.image = new Image();
    this.image.src = cloudImage;
    this.x = x;
    this.y = y;
    this.speed = DEFAULT_WORLD_SHIFT * 0.5;
    const scaleFactor = randfloat(0.6, 0.8);
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

  update(delta: number, shiftSpeed = 1) {
    this.x -= this.speed * shiftSpeed * delta;
  }
}
