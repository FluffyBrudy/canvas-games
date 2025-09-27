import type { Coor } from "../types/types.type";

export class Rect {
  public x: number;
  public y: number;
  public width = 0;
  public height = 0;

  constructor(x: number, y: number, w = 0, h = 0) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }

  get center(): Coor {
    return {
      x: this.x + Math.round(this.width / 2),
      y: this.y + Math.round(this.height / 2),
    };
  }

  get left() {
    return this.x;
  }
  get right() {
    return this.x + this.width;
  }
  get top() {
    return this.y;
  }
  get bottom() {
    return this.y + this.height;
  }

  set left(x: number) {
    this.x = ~~x;
  }

  set right(x: number) {
    this.x = ~~(x - this.width);
  }

  set top(y: number) {
    this.y = ~~y;
  }

  set bottom(y: number) {
    this.y = ~~(y - this.height);
  }

  set center(coor: Coor) {
    this.x = ~~(coor.x - this.width / 2);
    this.y = ~~(coor.y - this.height / 2);
  }

  scale(ratio: number) {
    return {
      w: ~~(this.width * ratio),
      h: ~~(this.height * ratio),
    };
  }

  scaleip(ratio: number) {
    this.width = ~~(this.width * ratio);
    this.height = ~~(this.height * ratio);
    return this;
  }

  scaleAroundCenter(ratio: number) {
    const c = this.center;
    this.width = ~~(this.width * ratio);
    this.height = ~~(this.height * ratio);
    this.center = c;
    return this;
  }

  collidepoint(x: Coor["x"], y: Coor["y"]) {
    return (
      x >= this.left && x <= this.right && y >= this.top && y <= this.bottom
    );
  }

  colliderect(rect: Rect) {
    return (
      this.left < rect.right &&
      rect.left < this.right &&
      this.top < rect.bottom &&
      rect.top < this.bottom
    );
  }

  coordinate() {
    return { x: this.x, y: this.y };
  }
}
