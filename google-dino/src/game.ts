import { BG_COLOR, MAX_SCREEN_HEIGHT, MAX_SCREEN_WIDTH } from "./constants";
import { Cloud } from "./sprites/cloud";
import { Dinasour } from "./sprites/dinasour";
import { Background } from "./ui/background";
import { randint } from "./utils/math.utils";

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private background: Background;
  private dino: Dinasour;
  private clouds: Set<Cloud>;
  private additionalShift = 1;

  constructor() {
    this.canvas = document.querySelector("canvas")!;
    this.ctx = this.canvas.getContext("2d")!;
    this.init();
    this.background = new Background(0, this.canvas.height / 2);
    this.dino = new Dinasour();
    this.dino.initPos(
      40,
      this.canvas.height / 2 + this.background.getHeight() / 2 + 5
    );
    this.clouds = new Set();
  }

  private manageCloud() {
    if (this.clouds.size === 0) {
      this.clouds.add(
        new Cloud(
          this.canvas.width * 1.5,
          this.canvas.height / 4 + randint(-50, 0)
        )
      );
    }
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
    this.manageCloud();
    this.background.update(delta, this.additionalShift);
    this.dino.update(delta);
    for (let cloud of this.clouds) {
      cloud.update(delta, this.additionalShift);
      if (cloud.isBeyondLeftEdge()) {
        this.clouds.delete(cloud);
      }
    }
  }

  public draw() {
    this.background.draw(this.ctx);
    for (let cloud of this.clouds) {
      if (cloud.isInView(this.canvas.width)) {
        cloud.draw(this.ctx);
      }
    }
    this.dino.draw(this.ctx);
  }

  public clearScreen() {
    this.ctx.fillStyle = BG_COLOR;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
