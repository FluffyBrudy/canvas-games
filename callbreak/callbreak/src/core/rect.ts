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

  get topright(): Coor {
    return { x: this.right, y: this.top };
  }
  set topright(coor: Coor) {
    this.right = coor.x;
    this.y = coor.y;
  }

  get bottomleft(): Coor {
    return { x: this.left, y: this.bottom };
  }
  set bottomleft(coor: Coor) {
    this.x = coor.x;
    this.bottom = coor.y;
  }

  get bottomright(): Coor {
    return { x: this.right, y: this.bottom };
  }
  set bottomright(coor: Coor) {
    this.right = coor.x;
    this.bottom = coor.y;
  }

  get midleft(): Coor {
    return { x: this.left, y: this.centery };
  }
  set midleft(coor: Coor) {
    this.left = coor.x;
    this.centery = coor.y;
  }

  get midright(): Coor {
    return { x: this.right, y: this.centery };
  }
  set midright(coor: Coor) {
    this.right = coor.x;
    this.centery = coor.y;
  }

  get midtop(): Coor {
    return { x: this.centerx, y: this.top };
  }
  set midtop(coor: Coor) {
    this.centerx = coor.x;
    this.top = coor.y;
  }

  get center(): Coor {
    return {
      x: this.centerx,
      y: this.centery,
    };
  }
  get midbottom(): Coor {
    return {
      x: this.centerx,
      y: this.bottom,
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

  get centerx() {
    return this.x + Math.round(this.width / 2);
  }

  get centery() {
    return this.y + Math.round(this.height / 2);
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

  set centerx(x: number) {
    this.x = ~~(x - this.width / 2);
  }

  set centery(y: number) {
    this.y = ~~(y - this.height / 2);
  }

  set center(coor: Coor) {
    this.centerx = coor.x;
    this.centery = coor.y;
  }

  set topleft(coor: Coor) {
    this.x = coor.x;
    this.y = coor.y;
  }

  set midbottom(coor: Coor) {
    this.centerx = coor.x;
    this.bottom = coor.y;
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

  inflate(amountX: number, amountY: number) {
    return new Rect(
      this.x - amountX / 2,
      this.y - amountY / 2,
      this.width + amountX,
      this.height + amountY
    );
  }
}
