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
  private background!: Background;
  private dino!: Dinasour;
  private cloudManager!: cloudManager;
  private cactusManager!: CactusManager;
  private birdManager!: BirdManager;
  private score: number = 0;
  private prevDistanceScore = 0;
  private assets: TAssets;
  private state: "WAITING_START" | "RUNNING" | "PAUSED" | "GAME_OVER" =
    "WAITING_START";
  private blinkTimer = 0;
  private blinkVisible = true;
  private restartBtnRect: {
    x: number;
    y: number;
    w: number;
    h: number;
  } | null = null;

  constructor(assets: TAssets) {
    this.assets = assets;
    Game.collidableSpritesImageData = Game.preloadSpritesData(assets);
    this.canvas = document.querySelector("canvas")!;
    this.ctx = this.canvas.getContext("2d")!;
    this.init();
    this.setupGameObjects();
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

  private setupGameObjects() {
    EnvironmentManager.initAttrs({
      viewWidth: this.canvas.width,
      viewHeight: this.canvas.height,
    });

    this.background = new Background(
      0,
      this.canvas.height / 2,
      this.assets.environment.bg
    );

    const [dinoX, dinoY] = [
      40,
      this.canvas.height / 2 + this.background.getHeight() / 2 + 5 - DINO_SIZE,
    ];
    this.dino = new Dinasour(this.assets.dino, dinoX, dinoY, DINO_SIZE);

    this.cloudManager = new cloudManager(this.assets.environment.cloud);

    this.cactusManager = new CactusManager(this.assets.cactus, {
      w: this.canvas.width,
      h: this.canvas.height,
    });

    const yConstrainBase =
      this.canvas.height / 2 +
      this.background.getHeight() / 2 -
      this.assets.bird.flap[0].height * 0.5;
    const yConstraints = [
      yConstrainBase - this.assets.bird.flap[0].height * 3,
      yConstrainBase - this.assets.bird.flap[0].height * 1.8,
      yConstrainBase - this.assets.bird.flap[0].height * 1.5,
    ];
    this.birdManager = new BirdManager(
      this.assets.bird.flap,
      {
        w: this.canvas.width,
        h: this.canvas.height,
      },
      yConstraints
    );

    this.score = 0;
    this.prevDistanceScore = 0;
    this.blinkTimer = 0;
    this.blinkVisible = true;
    this.restartBtnRect = null;

    this.state = this.state || "WAITING_START";
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

    this.setupGameObjects();
  }

  public handleEvent() {
    window.addEventListener("keydown", (k) => {
      if (this.state === "WAITING_START") {
        if (k.key === "ArrowUp" || k.key === " ") {
          this.startGame();
        }
        return;
      }

      if (this.state === "RUNNING") {
        if (k.key === "ArrowUp" || k.key === " ") {
          this.dino.changeState("UP");
        } else if (k.key === "ArrowDown") {
          this.dino.changeState("DOWN");
        } else if (k.key === "Escape") {
          this.state = "PAUSED";
        }
      } else if (this.state === "PAUSED") {
        if (k.key === "Escape") this.state = "RUNNING";
      } else if (this.state === "GAME_OVER") {
        if (k.key.toLowerCase() === "r") this.restartGame(true);
        if (k.key === "Escape") this.restartGame(true);
      }
    });
    window.addEventListener("keyup", (k) => {
      if (this.state === "RUNNING" && k.key === "ArrowDown")
        this.dino.changeState("RESET");
    });

    this.canvas.addEventListener("click", (e) => this.handleClick(e));
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
    if (this.state === "WAITING_START") {
      this.blinkTimer += delta;
      if (this.blinkTimer >= 0.5) {
        this.blinkTimer = 0;
        this.blinkVisible = !this.blinkVisible;
      }
      return;
    }

    if (this.state === "PAUSED" || this.state === "GAME_OVER") {
      return;
    }

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

    if (this.state === "WAITING_START") {
      if (this.blinkVisible) this.drawStartPrompt();
    } else if (this.state === "PAUSED") {
      this.drawOverlay("Paused");
      this.drawRestartButton();
    } else if (this.state === "GAME_OVER") {
      this.drawOverlay("Game Over");
      this.drawRestartButton();
    }
  }

  public clearScreen() {
    this.ctx.fillStyle = BG_COLOR;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private startGame() {
    this.state = "RUNNING";

    this.dino.changeState("RESET");
  }

  private restartGame(startImmediately: boolean) {
    this.setupGameObjects();
    this.state = startImmediately ? "RUNNING" : "WAITING_START";
    if (startImmediately) this.dino.changeState("RESET");
  }

  private handleClick(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (this.state === "WAITING_START") {
      this.startGame();
      return;
    }

    if (this.state === "PAUSED" || this.state === "GAME_OVER") {
      if (this.restartBtnRect) {
        const { x: bx, y: by, w, h } = this.restartBtnRect;
        if (x >= bx && x <= bx + w && y >= by && y <= by + h) {
          this.restartGame(true);
        }
      }
    }
  }

  private drawStartPrompt() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = "#fff";
    ctx.font = "24px font-game";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Click to run", this.canvas.width / 2, this.canvas.height / 2);
    ctx.restore();
  }

  private drawOverlay(title: string) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = "#fff";
    ctx.font = "28px font-game";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(title, this.canvas.width / 2, this.canvas.height * 0.25);

    ctx.font = "20px font-game";
    ctx.fillText(
      `Score: ${~~this.score}`,
      this.canvas.width / 2,
      this.canvas.height * 0.25 + 40
    );
    ctx.restore();
  }

  private drawRestartButton() {
    const img = this.assets.button.restart;
    const ctx = this.ctx;
    const desiredW = Math.min(128, this.canvas.width * 0.3);
    const scale = desiredW / img.width;
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (this.canvas.width - w) / 2;
    const y = this.canvas.height * 0.55;

    ctx.drawImage(img, x, y, w, h);
    this.restartBtnRect = { x, y, w, h };
  }

  handleCollision() {
    const cactusSprites = this.cactusManager.getSprites();
    const birdSprites = this.birdManager.getSprites();
    const [state, frame] = this.dino.getStateAndFrame();

    for (let sprite of cactusSprites) {
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
        this.state = "GAME_OVER";
        return;
      }
    }

    for (let bird of birdSprites) {
      const bFrame = bird.getFrameIndex();
      const collision = pixelPerfectCollision(
        {
          rect: this.dino.getRect(),
          pix: Game.collidableSpritesImageData.dino[state][frame],
        },
        {
          rect: bird.getRect(),
          pix: Game.collidableSpritesImageData.bird.flap[bFrame],
        }
      );
      if (collision) {
        this.state = "GAME_OVER";
        return;
      }
    }
  }
}
