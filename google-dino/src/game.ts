import { BG_COLOR, MAX_SCREEN_HEIGHT, MAX_SCREEN_WIDTH } from "./constants";
import { Background } from "./ui/background";

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private background: Background;

  constructor() {
    this.canvas = document.querySelector("canvas")!;
    this.ctx = this.canvas.getContext("2d")!;
    this.init();
    this.background = new Background(
      0,
      this.canvas.height / 2,
      this.canvas.width
    );
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

  public update() {
    this.background.update();
  }

  public draw() {
    this.background.draw(this.ctx);
  }

  public clearScreen() {
    this.ctx.fillStyle = BG_COLOR;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
