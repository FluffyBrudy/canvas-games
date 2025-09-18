import { BG_COLOR } from "./constants";

export class CanvasInterface {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.querySelector("canvas")!;
    this.ctx = this.canvas.getContext("2d")!;
    this.init();
  }

  public init() {
    this.ctx.fillStyle = BG_COLOR;
    this.ctx.fill();
  }

  public onResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  public clearScreen() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
