import type { TAssets } from "../../constants";
import { randint } from "../../utils/math.utils";
import { Cactus } from "./cactus";

interface DepAttrs {
  viewWidth: number;
  viewHeight: number;
}

type CactusObstacleFrames = TAssets["cactus"];
type DefaultFramesType = readonly HTMLImageElement[];
type ObstacleFrameType = keyof CactusObstacleFrames;

type SpriteAbstractMethod = {
  update: (delta: number, playerSpeed: number) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
};
export abstract class ObstacleManager<
  T extends object & SpriteAbstractMethod,
  FT = DefaultFramesType
> {
  protected static depAttrs: DepAttrs;
  private sprites: Set<T>;
  protected worldX: number;
  protected frames: FT;
  protected spawnGap: number;
  protected nextSpawnDistance: number;
  protected obstacleType: ObstacleFrameType;

  constructor(frames: FT) {
    if (!ObstacleManager.depAttrs)
      throw new Error("must initialize dependency attributes");

    this.worldX = 100;
    this.nextSpawnDistance = 300;
    this.spawnGap = 120;
    this.obstacleType = "largeDouble";
    this.frames = Object.freeze(frames);
    this.sprites = new Set();
  }

  abstract spawn(distance: number): void;
  abstract draw(ctx: CanvasRenderingContext2D, rightEdge: number): void;
  abstract update(delta: number, distance: number, playerSpeed: number): void;

  public static initAttrs(depAttrs: DepAttrs) {
    this.depAttrs = depAttrs;
  }

  protected getSprites() {
    return this.sprites;
  }

  public add(sprite: T) {
    this.sprites.add(sprite);
  }

  public remove(sprite: T) {
    this.sprites.delete(sprite);
  }

  public size() {
    return this.sprites.size;
  }
}

export class CactusManager extends ObstacleManager<
  Cactus,
  CactusObstacleFrames
> {
  private readonly maxObstacles = 10;
  private readonly minGap = 50;
  private readonly maxGap = 200;

  constructor(frames: CactusObstacleFrames) {
    super(frames);
  }

  private shouldSpawn(distance: number): boolean {
    return (
      this.size() < this.maxObstacles && distance >= this.nextSpawnDistance
    );
  }

  private computeNextSpawnDistance(distance: number) {
    const offset = randint(this.minGap, this.maxGap) + randint(0, 50);
    this.nextSpawnDistance = distance + offset;
    return this.nextSpawnDistance;
  }

  spawn(distance: number) {
    if (!this.shouldSpawn(distance)) return;

    const typeKey = this.chooseObstacleType();
    const type = this.frames[typeKey];
    const worldX = this.computeNextSpawnDistance(distance);
    const groundY = CactusManager.depAttrs.viewHeight;

    this.add(new Cactus(worldX, groundY, type));
  }

  private chooseObstacleType(): ObstacleFrameType {
    const types = Object.keys(this.frames) as ObstacleFrameType[];
    const choice = types[randint(0, types.length - 1)];
    this.obstacleType = choice;
    return choice;
  }

  update(delta: number, distance: number, playerSpeed: number) {
    this.spawn(distance);
    const sprites = this.getSprites();

    for (let sprite of sprites) {
      sprite.update(delta, playerSpeed);
      if (sprite.isBeyondLeftEdge()) {
        this.remove(sprite);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const sprites = this.getSprites();
    for (let sprite of sprites) {
      if (sprite.isInView(CactusManager.depAttrs.viewWidth)) {
        sprite.draw(ctx);
      }
    }
  }
}
