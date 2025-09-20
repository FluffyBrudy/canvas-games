import { randint } from "../utils/math.utils";
import { Cloud } from "./cloud";

interface DepAttrs {
  viewWidth: number;
  viewHeight: number;
}

export class SpriteManager<
  T extends {
    update(delta: number, shift: number): void;
    draw(ctx: CanvasRenderingContext2D): void;
    isBeyondLeftEdge(): boolean;
    isInView(width: number): boolean;
  }
> {
  protected static depAttrs: DepAttrs;
  private sprites: Set<T>;

  constructor() {
    if (!SpriteManager.depAttrs)
      throw new Error("must initialize dependency attributes");
    this.sprites = new Set();
  }

  public static initAttrs(depAttrs: DepAttrs) {
    this.depAttrs = depAttrs;
  }

  public add(sprite: T) {
    this.sprites.add(sprite);
  }

  public update(delta: number, shift: number) {
    for (let sprite of this.sprites) {
      sprite.update(delta, shift);
      if (sprite.isBeyondLeftEdge()) {
        this.sprites.delete(sprite);
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D, canvasWidth: number) {
    for (let sprite of this.sprites) {
      if (sprite.isInView(canvasWidth)) {
        sprite.draw(ctx);
      }
    }
  }

  public size() {
    return this.sprites.size;
  }
}

export class cloudManager extends SpriteManager<Cloud> {
  private prviousSpawnTime: number;
  private nextSpawnDelay: number;
  private minSpace: number;
  private maxSpace: number;

  constructor() {
    super();
    this.prviousSpawnTime = Date.now();
    this.nextSpawnDelay = 0;
    this.minSpace = 100;
    this.maxSpace = 300;
  }

  spwan() {
    const timeDiff = Date.now() - this.prviousSpawnTime;

    if (timeDiff >= this.nextSpawnDelay && this.size() < 6) {
      const { viewHeight, viewWidth } = cloudManager.depAttrs;
      const x = viewWidth + randint(this.minSpace, this.maxSpace);
      const y = viewHeight / 4 + randint(-50, 50);
      this.add(new Cloud(x, y));
      this.nextSpawnDelay = randint(2000, 5000);
      this.prviousSpawnTime = Date.now();
    }
  }

  public update(delta: number, shift: number): void {
    this.spwan();
    super.update(delta, shift);
  }
}
