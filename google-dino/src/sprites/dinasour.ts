import {
  DEFAULT_WORLD_SHIFT,
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
  private x: number;
  private y: number;
  private size: number;
  private groundY: number = 0;
  private traveledDistance: number;
  private nextSpeedIncDist = 100;
  private prevSpeedIncDist = 100;
  private speedIncrement = 0.5;
  private currentSpeed = DEFAULT_WORLD_SHIFT;
  private altFactor = 0;

  constructor(
    stateAnimations: TAssets["dino"],
    x: number,
    y: number,
    size: number
  ) {
    this.x = x;
    this.y = y;
    this.groundY = this.y;
    this.size = size;
    this.frameIndex = 0;
    this.animationSpeed = 12;
    this.state = "run";
    this.animationStates = stateAnimations;

    this.jumpProgress = 0;
    this.jumpStep = 100;
    this.isJumping = false;
    this.isDuckQueue = false;

    this.traveledDistance = 0;
  }

  public get distance(): number {
    return this.traveledDistance;
  }

  public get speed(): number {
    return this.currentSpeed;
  }

  public getPosition() {
    return { x: this.x, y: this.y };
  }

  jump() {
    this.isJumping = true;
    this.jumpProgress = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const currentFrame = this.animationStates[this.state][~~this.frameIndex];

    ctx.drawImage(
      currentFrame,
      this.x,
      this.y + this.altFactor,
      this.size + this.altFactor,
      this.size - this.altFactor
    );
  }

  private animate(delta: number) {
    this.frameIndex += this.animationSpeed * delta;
    if (this.frameIndex >= this.animationStates[this.state].length) {
      this.frameIndex = 0;
    }
  }

  manageJump(delta: number) {
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

  manageDuck() {
    if (this.state === "duck") {
      this.altFactor = 8;
    } else {
      this.altFactor = 0;
    }
  }

  update(delta: number) {
    this.traveledDistance += delta * this.currentSpeed;
    if (this.traveledDistance >= this.nextSpeedIncDist) {
      this.currentSpeed += this.speedIncrement;
      this.prevSpeedIncDist = this.nextSpeedIncDist;
      this.nextSpeedIncDist = this.prevSpeedIncDist + this.nextSpeedIncDist;
    }
    this.animate(delta);
    this.manageDuck();
    this.manageJump(delta);
  }

  getRect() {
    return {
      x: this.x,
      y: this.y + this.altFactor,
      w: this.size + this.altFactor,
      h: this.size - this.altFactor,
    };
  }

  getCurrentFrameSize() {
    const currentFrame = this.animationStates[this.state][this.frameIndex];
    return {
      w: currentFrame.width,
      h: currentFrame.height,
      image: currentFrame,
    };
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
      this.isDuckQueue = false;
    }
  }

  getStateAndFrame(): [TDinoState, number] {
    return [this.state, ~~this.frameIndex];
  }
}
