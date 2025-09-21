export interface Size {
  w: number;
  h: number;
}

export abstract class BaseObstacle {
  protected x: number;
  protected y: number;
  protected size: Size;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.size = { w: 0, h: 0 };
  }

  abstract draw(ctx: CanvasRenderingContext2D): void;
  abstract update(delta: number, shiftSpeed?: number): void;

  isBeyondLeftEdge(): boolean {
    return this.x + this.size.w < 0;
  }

  isInView(rightEdge: number, leftEdge: number = -this.size.w): boolean {
    return this.x >= leftEdge && this.x <= rightEdge;
  }

  getSize(): Size {
    return this.size;
  }

  getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }
}
