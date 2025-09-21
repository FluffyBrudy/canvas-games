import type { TAssets } from "../../constants";
import { randint } from "../../utils/math.utils";
import { Bird } from "./bird";
import { Cactus } from "./cactus";

export class CactusManager {
  private cactiImages: TAssets["cactus"];
  private viewSize: { w: number; h: number };

  private readonly maxObstacles = 10;
  private readonly minGap;
  private readonly maxGap;

  private sprites = new Set<Cactus>();

  constructor(
    cactiImages: TAssets["cactus"],
    viewSize: { w: number; h: number }
  ) {
    this.viewSize = { ...viewSize, h: viewSize.h + 20 };
    this.cactiImages = cactiImages;
    this.minGap = cactiImages.largeDouble.width * 2;
    this.maxGap = cactiImages.largeDouble.width * 5;
    this.sprites.add(
      new Cactus(viewSize.w + 50, this.viewSize.h / 2, cactiImages.largeDouble)
    );
  }

  public getSprites() {
    return this.sprites;
  }

  public spawn() {
    if (this.sprites.size >= this.maxObstacles) return;
    if (this.sprites.size === 0) {
      this.sprites.add(
        new Cactus(
          this.viewSize.w + 50,
          this.viewSize.h / 2,
          this.cactiImages.largeDouble
        )
      );
    }
    const lastCactusX = Array.from(this.sprites)
      .map((cactus) => cactus.getPosition().x)
      .sort((a, b) => b - a)[0];
    const y = this.viewSize.h / 2;
    if (lastCactusX < this.viewSize.w + this.minGap) {
      const x = this.viewSize.w + randint(this.minGap, this.maxGap);
      this.sprites.add(new Cactus(x, y, this.cactiImages.largeDouble));
    } else {
      const x = lastCactusX + randint(this.minGap, this.maxGap);
      this.sprites.add(new Cactus(x, y, this.cactiImages.largeDouble));
    }
  }

  public update(delta: number, playerSpeed: number) {
    this.spawn();
    for (let cactus of this.sprites) {
      cactus.update(delta, playerSpeed);
      if (cactus.isBeyondLeftEdge()) {
        this.sprites.delete(cactus);
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    for (const cactus of this.sprites) {
      if (cactus.isInView(this.viewSize.w)) {
        cactus.draw(ctx);
      }
    }
  }
}

export class BirdManager {
  private birds = new Set<Bird>();
  private birdFrames: readonly HTMLImageElement[];
  private viewSize: { w: number; h: number };

  private readonly maxBirds = 2;
  private distanceSinceLastBird = 0;
  private spawnDistanceThreshold = 300;
  private spawnProbability = 0.01;
  private yConstraints: number[];

  constructor(
    birdFrames: readonly HTMLImageElement[],
    viewSize: { w: number; h: number },
    yConstrain: number[]
  ) {
    this.viewSize = viewSize;
    this.birdFrames = birdFrames;
    this.yConstraints = yConstrain;
  }
  private trySpawn(
    playerSpeed: number,
    delta: number,
    toRespectSprites: Set<Cactus>
  ) {
    this.distanceSinceLastBird += playerSpeed * delta;

    if (
      this.distanceSinceLastBird <= this.spawnDistanceThreshold ||
      Math.random() >= this.spawnProbability ||
      this.birds.size >= this.maxBirds
    )
      return;

    const x = this.viewSize.w + 100;
    const yIndex = randint(0, this.yConstraints.length - 1);
    const y = this.yConstraints[yIndex];

    const newBird = new Bird(x, y, this.birdFrames);

    this.birds.add(newBird);
    this.distanceSinceLastBird = 0;
  }

  public update(
    delta: number,
    playerSpeed: number,
    toRespectSprites: Set<Cactus>
  ) {
    this.trySpawn(playerSpeed, delta, toRespectSprites);

    for (const bird of this.birds) {
      bird.update(delta, playerSpeed);
      if (bird.isBeyondLeftEdge()) this.birds.delete(bird);
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    for (const bird of this.birds) {
      if (bird.isInView(this.viewSize.w)) bird.draw(ctx);
    }
  }
}
