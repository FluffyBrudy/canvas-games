import { randint } from "../utils/math.utils";
import { Cloud } from "./cloud";
import type { Bird } from "./obstacles/bird";

interface DepAttrs {
  viewWidth: number;
  viewHeight: number;
}

export abstract class SpriteManager<
  T extends {
    update(delta: number, shift: number): void;
    draw(ctx: CanvasRenderingContext2D): void;
    isBeyondLeftEdge(): boolean;
    isInView(width: number): boolean;
  }
> {
  protected prviousSpawnTime: number;
  protected nextSpawnDelay: number;
  protected minSpace: number;
  protected maxSpace: number;
  protected static depAttrs: DepAttrs;
  protected entityFrames!: readonly HTMLImageElement[];
  private sprites: Set<T>;

  constructor(
    entityFrames: HTMLImageElement[],
    spacing?: { max: number; min: number }
  ) {
    if (!SpriteManager.depAttrs)
      throw new Error("must initialize dependency attributes");

    this.entityFrames = entityFrames;
    this.sprites = new Set();

    this.nextSpawnDelay = 0;
    this.prviousSpawnTime = Date.now();
    this.minSpace = spacing?.min || this.entityFrames[0].width;
    this.maxSpace = spacing?.max || this.entityFrames[0].width * 2;
  }

  abstract spwan(): void;
  public static initAttrs(depAttrs: DepAttrs) {
    this.depAttrs = depAttrs;
  }

  public add(sprite: T) {
    this.sprites.add(sprite);
  }

  public update(delta: number, shift: number) {
    this.spwan();
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
  constructor(image: HTMLImageElement, spacing?: { max: number; min: number }) {
    super([image], spacing);
  }

  spwan() {
    const timeDiff = Date.now() - this.prviousSpawnTime;
    if (timeDiff >= this.nextSpawnDelay && this.size() < 6) {
      const { viewHeight, viewWidth } = cloudManager.depAttrs;
      const x = viewWidth + randint(this.minSpace, this.maxSpace);
      const y = viewHeight / 4 + randint(-50, 50);
      this.add(new Cloud(x, y, this.entityFrames[0]));
      this.nextSpawnDelay = randint(2000, 5000);
      this.prviousSpawnTime = Date.now();
    }
  }

  public update(delta: number, shift: number): void {
    super.update(delta, shift);
  }
}

export class BirdManager extends SpriteManager<Bird> {
  constructor(
    stateFrames: HTMLImageElement[],
    spacing?: { max: number; min: number }
  ) {
    super(stateFrames, spacing);
    this.entityFrames = Object.freeze(stateFrames);
  }

  spwan() {}

  public update(delta: number, shift: number): void {
    super.update(delta, shift);
  }
}
