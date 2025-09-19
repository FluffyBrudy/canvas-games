import dead1 from "../assets/graphics/dino/dead/dead.png";
import dead2 from "../assets/graphics/dino/dead/crash.png";
import idel from "../assets/graphics/dino/idle/idle.png";
import duck1 from "../assets/graphics/dino/duck/duck1.png";
import duck2 from "../assets/graphics/dino/duck/duck2.png";
import firstMovement from "../assets/graphics/dino/movement/first.png";
import secondMovement from "../assets/graphics/dino/movement/second.png";
import { DINO_SIZE, type TDinoState, type TKeyType } from "../constants";

export class Dinasour {
  private state: TDinoState;
  private readonly animationStates: ReturnType<typeof loadStates>;
  private frameIndex: number;
  private animationSpeed: number;
  private jumpProgress: number;
  private jumpStep: number;
  private isJumping: boolean;
  private x: number = 0;
  private y: number = 0;
  private groundY: number = 0;

  constructor() {
    this.frameIndex = 0;
    this.animationSpeed = 0.1;
    this.state = "run";
    this.animationStates = loadStates();

    this.jumpProgress = 0;
    this.jumpStep = 80;
    this.isJumping = false;
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
    this.frameIndex += this.animationSpeed;
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
        this.state = "run";
      }
    }
  }

  getCurrentFrameSize() {
    const currentFrame = this.animationStates[this.state][this.frameIndex];
    return { w: currentFrame.width, h: currentFrame.height };
  }

  changeState(keyType: TKeyType) {
    if (this.isJumping) return;
    if (keyType === "UP") {
      this.state = "jump";
      this.isJumping = true;
    } else if (keyType === "DOWN") {
      this.state = "duck";
    } else if (keyType === "RESET") {
      this.state = "run";
    }
  }
}

function loadStates() {
  const idle = loadAssets([idel]);
  const jump = idle;
  const run = loadAssets([firstMovement, secondMovement]);
  const duck = loadAssets([duck1, duck2]);
  const dead = loadAssets([dead1, dead2]);
  return Object.freeze({ idle, jump, run, duck, dead });
}

function loadAssets(paths: string[]) {
  const frames = paths.map((frame) => {
    const img = new Image();
    img.src = frame;
    return img;
  });
  return frames;
}
