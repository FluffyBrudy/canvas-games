import largeDouble from "../assets/graphics/cactus/largedouble.png";
import largeMany from "../assets/graphics/cactus/largemany.png";
import manySmall from "../assets/graphics/cactus/manysmall.png";
import { DEFAULT_WORLD_SHIFT } from "../../constants";
import { randint } from "../../utils/math.utils";
import { BaseObstacle } from "./base";

interface CactusType {
  src: string;
  scale: number;
}

const cactusTypes: CactusType[] = [
  { src: largeDouble, scale: 0.8 },
  { src: largeMany, scale: 0.9 },
  { src: manySmall, scale: 0.9 },
];

export class Cactus extends BaseObstacle {
  private image: HTMLImageElement;

  constructor(x: number, y: number) {
    super(x, y);
    const type = cactusTypes[randint(0, cactusTypes.length - 1)];

    this.image = new Image();
    this.image.src = type.src;

    this.x = x;
    this.y = y;
    this.speed = DEFAULT_WORLD_SHIFT;

    this.size = Object.freeze({
      w: type.scale * this.image.width,
      h: type.scale * this.image.height,
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image, this.x, this.y, this.size.w, this.size.h);
  }

  update(delta: number, shiftSpeed = 1) {
    this.x -= this.speed * shiftSpeed * delta;
  }
}
