import {
  BG_COLOR,
  MAX_SCREEN_HEIGHT,
  MAX_SCREEN_WIDTH,
  type TAssets,
} from "./constants";
import { Dinasour } from "./sprites/dinasour";
import { BirdManager, cloudManager, SpriteManager } from "./sprites/manager";
import { Background } from "./ui/background";

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private background: Background;
  private dino: Dinasour;
  private cloudManager: cloudManager;
  private birdManager: BirdManager;
  private additionalShift = 1;

  constructor(assets: TAssets) {
    this.canvas = document.querySelector("canvas")!;
    this.ctx = this.canvas.getContext("2d")!;
    this.init();
    this.background = new Background(
      0,
      this.canvas.height / 2,
      assets.environment.bg
    );
    this.dino = new Dinasour(assets.dino);
    this.dino.initPos(
      40,
      this.canvas.height / 2 + this.background.getHeight() / 2 + 5
    );
    SpriteManager.initAttrs({
      viewWidth: this.canvas.width,
      viewHeight: this.canvas.height,
    });
    this.cloudManager = new cloudManager(assets.environment.cloud);
    this.birdManager = new BirdManager(assets.bird.flap);
  }

  public init() {
    this.canvas.width = Math.min(window.innerWidth, MAX_SCREEN_WIDTH);
    this.canvas.height = Math.min(window.innerHeight, MAX_SCREEN_HEIGHT);
    this.ctx.fillStyle = BG_COLOR;
    this.ctx.fill();
  }

  public onResize() {
    this.canvas.width = Math.min(window.innerWidth, MAX_SCREEN_WIDTH);
    this.canvas.height = Math.min(window.innerHeight, MAX_SCREEN_HEIGHT);
  }

  public handleEvent() {
    window.addEventListener("keydown", (k) => {
      if (k.key === "ArrowUp") {
        this.dino.changeState("UP");
      } else if (k.key === "ArrowDown") {
        this.dino.changeState("DOWN");
      }
    });
    window.addEventListener("keyup", (k) => {
      if (k.key === "ArrowDown") this.dino.changeState("RESET");
    });
  }

  public update(delta: number) {
    this.background.update(delta, this.additionalShift);
    this.cloudManager.update(delta, this.additionalShift);
    this.birdManager.update(delta, this.additionalShift);
    this.dino.update(delta);
  }

  public draw() {
    this.background.draw(this.ctx);
    this.cloudManager.draw(this.ctx, this.canvas.width);
    this.birdManager.draw(this.ctx, this.canvas.width);
    this.dino.draw(this.ctx);
  }

  public clearScreen() {
    this.ctx.fillStyle = BG_COLOR;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
