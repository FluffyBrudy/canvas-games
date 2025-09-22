import {
  BG_COLOR,
  BIRD_SCALE,
  CACTUS_LARGE_DOUBLE_SCALE,
  DINO_SIZE,
  DUCK_ALT_FACTOR,
  MAX_SCREEN_HEIGHT,
  MAX_SCREEN_WIDTH,
  type PreloadedSpritesImageData,
  type TAssets,
} from "./constants";
import { Dinasour } from "./sprites/dinasour";
import { cloudManager, EnvironmentManager } from "./environment/manager";
import { BirdManager, CactusManager } from "./sprites/obstacles/manager";
import { Background } from "./environment/background";
import {
  getImageColorUint8Array,
  pixelPerfectCollision,
} from "./utils/image.utils";

export class Game {
  private static collidableSpritesImageData: PreloadedSpritesImageData;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private background: Background;
  private dino: Dinasour;
  private cloudManager: cloudManager;
  private cactusManager: CactusManager;
  private birdManager: BirdManager;
  private score: number = 0;
  private prevDistanceScore = 0;
  private pause: boolean = true;

  constructor(assets: TAssets) {
    Game.collidableSpritesImageData = Game.preloadSpritesData(assets);
    console.log(Game.collidableSpritesImageData.cactus.largeDouble);
    this.canvas = document.querySelector("canvas")!;
    this.ctx = this.canvas.getContext("2d")!;
    this.init();
    this.background = new Background(
      0,
      this.canvas.height / 2,
      assets.environment.bg
    );

    const [dinoX, dinoY] = [
      40,
      this.canvas.height / 2 + this.background.getHeight() / 2 + 5 - DINO_SIZE,
    ];

    this.dino = new Dinasour(assets.dino, dinoX, dinoY, DINO_SIZE);
    EnvironmentManager.initAttrs({
      viewWidth: this.canvas.width,
      viewHeight: this.canvas.height,
    });

    this.cloudManager = new cloudManager(assets.environment.cloud);
    this.cactusManager = new CactusManager(assets.cactus, {
      w: this.canvas.width,
      h: this.canvas.height,
    });
    const yConstrainBase =
      this.canvas.height / 2 +
      this.background.getHeight() / 2 -
      assets.bird.flap[0].height * 0.5;
    const yConstraints = [
      yConstrainBase - assets.bird.flap[0].height * 3,
      yConstrainBase - assets.bird.flap[0].height * 1.8,
      yConstrainBase - assets.bird.flap[0].height * 1.5,
    ];
    this.birdManager = new BirdManager(
      assets.bird.flap,
      {
        w: this.canvas.width,
        h: this.canvas.height,
      },
      yConstraints
    );
  }

  static preloadSpritesData(assets: TAssets) {
    const dinoBaseSize = { w: DINO_SIZE, h: DINO_SIZE };
    const dinoDuckSize = {
      w: DINO_SIZE + DUCK_ALT_FACTOR,
      h: DINO_SIZE - DUCK_ALT_FACTOR,
    };
    const dinoFrameColorArray = {
      idle: assets.dino.idle.map((frame) =>
        getImageColorUint8Array(frame, dinoBaseSize)
      ),
      duck: assets.dino.duck.map((frame) =>
        getImageColorUint8Array(frame, dinoDuckSize)
      ),
      run: assets.dino.run.map((frame) =>
        getImageColorUint8Array(frame, dinoBaseSize)
      ),
      jump: assets.dino.jump.map((frame) =>
        getImageColorUint8Array(frame, dinoBaseSize)
      ),
      dead: assets.dino.dead.map((frame) =>
        getImageColorUint8Array(frame, dinoBaseSize)
      ),
    };
    const cactusesColorArray = Object.entries(assets.cactus).reduce(
      (accm, [key, img]) => {
        accm[key as keyof TAssets["cactus"]] = getImageColorUint8Array(
          img,
          CACTUS_LARGE_DOUBLE_SCALE
        );
        return accm;
      },
      {} as Record<
        keyof TAssets["cactus"],
        ReturnType<typeof getImageColorUint8Array>
      >
    );
    const birdFramesColorArray = {
      flap: assets.bird.flap.map((frame) =>
        getImageColorUint8Array(frame, BIRD_SCALE)
      ),
    };
    return {
      dino: dinoFrameColorArray,
      cactus: cactusesColorArray,
      bird: birdFramesColorArray,
    };
  }

  public init() {
    this.canvas.width = Math.min(window.innerWidth, MAX_SCREEN_WIDTH);
    this.canvas.height = Math.min(window.innerHeight, MAX_SCREEN_HEIGHT);
    this.ctx.fillStyle = BG_COLOR;
    this.ctx.fill();
  }

  public onResize() {
    this.canvas.width = Math.min(window.innerWidth, MAX_SCREEN_WIDTH);
    this.canvas.height = Math.min(window.innerHeight, MAX_SCREEN_HEIGHT);
  }

  public handleEvent() {
    window.addEventListener("keydown", (k) => {
      if (k.key === "ArrowUp" || k.key === " ") {
        this.dino.changeState("UP");
      } else if (k.key === "ArrowDown") {
        this.dino.changeState("DOWN");
      } else if (k.key === "Escape") {
        this.pause = !this.pause;
      }
    });
    window.addEventListener("keyup", (k) => {
      if (k.key === "ArrowDown") this.dino.changeState("RESET");
    });
  }

  updateScore() {
    this.score += (this.dino.distance - this.prevDistanceScore) / 10;
    this.prevDistanceScore = this.dino.distance;
  }

  drawScore() {
    this.ctx.font = "48px font-game";
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "right";
    this.ctx.textBaseline = "top";
    this.ctx.fillText(`${~~this.score}`, this.canvas.width, 0);
  }

  public update(delta: number) {
    if (this.pause) return;
    this.updateScore();
    this.background.update(delta, this.dino.speed);
    this.cloudManager.update(delta, this.dino.speed);
    this.cactusManager.update(delta, this.dino.speed);
    this.birdManager.update(delta, this.dino.speed);
    this.dino.update(delta);
    this.handleCollision();
  }

  public draw() {
    this.background.draw(this.ctx);
    this.cloudManager.draw(this.ctx);
    this.cactusManager.draw(this.ctx);
    this.birdManager.draw(this.ctx);
    this.dino.draw(this.ctx);
    this.drawScore();
  }

  public clearScreen() {
    this.ctx.fillStyle = BG_COLOR;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  handleCollision() {
    const sprites = this.cactusManager.getSprites();
    const [state, frame] = this.dino.getStateAndFrame();
    for (let sprite of sprites) {
      const cactusState = sprite.getType();
      const collision = pixelPerfectCollision(
        {
          rect: this.dino.getRect(),
          pix: Game.collidableSpritesImageData.dino[state][frame],
        },
        {
          rect: sprite.getRect(),
          pix: Game.collidableSpritesImageData.cactus[cactusState],
        }
      );
      if (collision) {
        location.reload();
      }
    }
  }
}
