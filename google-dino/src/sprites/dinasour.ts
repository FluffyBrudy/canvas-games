import {
  DINO_SIZE,
  type TAssets,
  type TDinoState,
  type TKeyType,
} from "../constants";

export class Dinasour {
  private state: TDinoState;
  private animationStates: TAssets["dino"];
  private frameIndex: number;
  private animationSpeed: number;
  private jumpProgress: number;
  private jumpStep: number;
  private isDuckQueue: boolean;
  private isJumping: boolean;
  private x: number = 0;
  private y: number = 0;
  private groundY: number = 0;

  constructor(stateAnimations: TAssets["dino"]) {
    this.frameIndex = 0;
    this.animationSpeed = 12;
    this.state = "run";
    this.animationStates = stateAnimations;

    this.jumpProgress = 0;
    this.jumpStep = 80;
    this.isJumping = false;
    this.isDuckQueue = false;
  }

  initPos(x: number, y: number) {
    this.x = x;
    this.y = ~~y - DINO_SIZE;
    this.groundY = this.y;
  }

  jump() {
    this.isJumping = true;
    this.jumpProgress = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const currentFrame = this.animationStates[this.state][~~this.frameIndex];
    let alterFactor = 0;
    if (this.state === "duck") {
      alterFactor = 8;
    }
    ctx.drawImage(
      currentFrame,
      this.x,
      this.y + alterFactor,
      DINO_SIZE + alterFactor,
      DINO_SIZE - alterFactor
    );
  }

  update(delta: number) {
    this.frameIndex += this.animationSpeed * delta;
    if (this.frameIndex >= this.animationStates[this.state].length) {
      this.frameIndex = 0;
    }

    if (this.isJumping) {
      this.jumpProgress += 1.85 * delta;
      const curve = Math.sin(Math.PI * this.jumpProgress);
      this.y = this.groundY - curve * this.jumpStep;
      if (this.jumpProgress >= 1) {
        this.jumpProgress = 0;
        this.isJumping = false;
        this.y = this.groundY;
        if (this.isDuckQueue) {
          this.state = "duck";
          this.isDuckQueue = false;
        } else {
          this.state = "run";
        }
      }
    }
  }

  getCurrentFrameSize() {
    const currentFrame = this.animationStates[this.state][this.frameIndex];
    return { w: currentFrame.width, h: currentFrame.height };
  }

  changeState(keyType: TKeyType) {
    if (keyType === "UP") {
      this.state = "jump";
      this.isJumping = true;
    } else if (keyType === "DOWN") {
      if (!this.isJumping) {
        this.state = "duck";
      } else {
        this.isDuckQueue = true;
      }
    } else if (keyType === "RESET") {
      this.state = "run";
    }
  }
}
