import type { TAssets } from "../../constants";
import { randint } from "../../utils/math.utils";
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

  public spawn() {
    if (this.sprites.size >= this.maxObstacles) return;
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
