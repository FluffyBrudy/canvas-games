import type { Rect } from "./rect";

interface IGroup<T extends Sprite> {
  remove(sprite?: T): void;
  add?(sprite: T): void;
  update?(kwargs?: Record<string, any>): void;
  draw?(ctx?: CanvasRenderingContext2D): void;
}

export class Group<T extends Sprite> implements IGroup<T> {
  private _sprites = new Set<T>();

  add(...sprites: T[]) {
    for (let sprite of sprites) {
      this._sprites.add(sprite);
      sprite._addGroup(this as IGroup<T>);
    }
  }

  remove(sprite?: T) {
    if (sprite) {
      this._sprites.delete(sprite);
      sprite._removeGroup(this);
    }
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

export class GroupSingle<T extends Sprite> implements IGroup<T> {
  private _sprite: T | null;

  constructor(sprite?: T) {
    this._sprite = sprite || null;
  }

  add(sprite: T) {
    this._sprite = sprite;
    sprite._addGroup(this);
  }

  remove() {
    if (!this._sprite) return;
    this._sprite._removeGroup(this);
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
  public rect!: Rect;

  protected _groups: (Group<Sprite> | GroupSingle<Sprite> | IGroup<Sprite>)[] =
    [];

  constructor(
    ...groups: (Group<Sprite> | GroupSingle<Sprite> | IGroup<Sprite>)[]
  ) {
    this._groups = groups;
  }

  _addGroup(group: IGroup<Sprite>) {
    if (!this._groups.includes(group)) this._groups.push(group);
  }

  _removeGroup(group: IGroup<Sprite>) {
    this._groups = this._groups.filter((g) => g !== group);
  }

  kill() {
    for (let group of this._groups) {
      group.remove(this);
    }
  }

  alive() {
    return this._groups.length > 0;
  }

  remove(groups: (Group<Sprite> | GroupSingle<Sprite> | IGroup<Sprite>)[]) {
    for (let group of groups) {
      group.remove(this);
    }
  }

  updateGroup(group: IGroup<Sprite>) {
    this._groups.push(group);
  }

  groups() {
    return [...this._groups];
  }

  colliderect(sprite: Sprite) {
    return this.rect.colliderect(sprite.rect);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image, this.rect.x, this.rect.y);
  }

  update(_?: Record<string, any>) {}
}
