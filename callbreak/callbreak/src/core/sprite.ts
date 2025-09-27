import type { Rect } from "./rect";

export class Group<T extends Sprite> {
  private _sprites = new Set<T>();

  /**
   * @param sprite append new sprites to group
   */
  add(...sprites: T[]) {
    for (let sprite of sprites) {
      this._sprites.add(sprite);
      sprite.updateGroup(this);
    }
  }

  remove(sprite: T) {
    this._sprites.delete(sprite);
  }

  sprites() {
    return this._sprites;
  }

  has(sprite: T) {
    return this._sprites.has(sprite);
  }

  empty() {
    this._sprites = new Set();
  }

  update(kwargs = {} as Record<string, any>): void {
    for (let sprite of this._sprites) {
      sprite.update(kwargs);
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    for (let sprite of this._sprites) {
      sprite.draw(ctx);
    }
  }
}

export class GroupSingle<T extends Sprite> {
  private _sprite: T | null;

  constructor(sprite?: T) {
    this._sprite = sprite || null;
  }

  /**
   * @param sprite replaces existing sprite
   */
  add(sprite: T) {
    this._sprite = sprite;
  }

  remove() {
    this._sprite = null;
  }

  sprite() {
    return this._sprite;
  }

  has(sprite: T) {
    return this._sprite === sprite;
  }

  update(kwargs = {} as Record<string, any>): void {
    this._sprite?.update(kwargs);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this._sprite?.draw(ctx);
  }
}

export class Sprite {
  protected image!: HTMLImageElement;
  protected rect!: Rect;
  protected _groups: Group<Sprite>[] = [];

  constructor(...groups: Group<Sprite>[]) {
    this._groups = groups;
  }

  kill() {
    console.log(this._groups, "***");
    for (let group of this._groups) {
      group.remove(this);
    }
  }

  alive() {
    return this._groups.length > 0;
  }

  remove<T extends Group<Sprite>>(groups: T[]) {
    for (let group of groups) {
      group.remove(this);
    }
  }

  updateGroup<T extends Sprite>(group: Group<T>) {
    this._groups.push(group);
  }

  groups() {
    return [...this._groups];
  }

  colliderect<T extends Sprite>(sprite: T) {
    return this.rect.colliderect(sprite.rect);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image, this.rect.x, this.rect.y);
  }

  update(_?: Record<string, any>) {}
}
