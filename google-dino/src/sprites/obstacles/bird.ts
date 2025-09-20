import { BaseObstacle } from "./base";
import { DEFAULT_WORLD_SHIFT } from "../../constants";

export class Bird extends BaseObstacle {
  private frameIndex: number;
  private animationSpeed: number;
  private animationFrames: readonly HTMLImageElement[];

  constructor(x: number, y: number, animationFrames: HTMLImageElement[]) {
    super(x, y);
    this.frameIndex = 0;
    this.speed = DEFAULT_WORLD_SHIFT;
    this.animationSpeed = 6;
    this.animationFrames = animationFrames;
    this.size = {
      w: animationFrames[0].width * 0.4,
      h: animationFrames[0].height * 0.4,
    };
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(
      this.animationFrames[~~this.frameIndex],
      this.x,
      this.y,
      this.size.w,
      this.size.h
    );
    console.log(this.x);
  }

  update(delta: number, shiftSpeed = 1): void {
    this.x -= delta * this.speed * shiftSpeed;

    this.frameIndex += this.animationSpeed * delta;
    if (this.frameIndex >= this.animationFrames.length) {
      this.frameIndex = 0;
    }
  }
}
