import { BaseObstacle } from "./base";

export class Bird extends BaseObstacle {
  private frameIndex: number;
  private animationSpeed: number;
  private animationFrames: readonly HTMLImageElement[];

  public getFrameIndex() {
    return ~~this.frameIndex;
  }

  constructor(
    x: number,
    y: number,
    animationFrames: readonly HTMLImageElement[]
  ) {
    super(x, y);
    this.frameIndex = 0;
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
  }

  update(delta: number, playerSpeed: number): void {
    this.x -= delta * playerSpeed;

    this.frameIndex += this.animationSpeed * delta;
    if (this.frameIndex >= this.animationFrames.length) {
      this.frameIndex = 0;
    }
  }
}
