import birdFlapUp from "../../assets/graphics/bird/flapup.png";
import birdFlapDown from "../../assets/graphics/bird/flapdown.png";
import { BaseObstacle } from "./base";
import { loadImages } from "../../utils/image.utils";
import { DEFAULT_WORLD_SHIFT } from "../../constants";

export class Bird extends BaseObstacle {
  private frameIndex: number;
  private animationSpeed: number;
  private animationStates: ReturnType<typeof loadStates>;

  constructor(x: number, y: number) {
    super(x, y);
    this.frameIndex = 0;
    this.speed = DEFAULT_WORLD_SHIFT;
    this.animationSpeed = 6;
    this.animationStates = loadStates();
    const imSize = this.animationStates.fly[0];
    this.size = { w: imSize.width * 0.4, h: imSize.height * 0.4 };
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(
      this.animationStates.fly[~~this.frameIndex],
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
    if (this.frameIndex >= this.animationStates.fly.length) {
      this.frameIndex = 0;
    }
  }
}

function loadStates() {
  return { fly: loadImages([birdFlapUp, birdFlapDown]) };
}
