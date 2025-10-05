import { Rect } from "../core/rect";
import { Button } from "./component/button";
import type { EventDepSpriteKwargs } from "../types/types.type";

export class MenuUI {
  private startButton: Button;
  public visible = true;
  private titleScale = 1;
  private titleScaleDirection = 1;
  private particles: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
  }[] = [];

  constructor(canvasWidth: number, canvasHeight: number, onStart: () => void) {
    const btnRect = new Rect(
      canvasWidth / 2 - 140,
      canvasHeight / 2 + 80,
      280,
      70
    );
    this.startButton = new Button(
      btnRect,
      "START GAME",
      () => {
        this.visible = false;
        onStart();
      },
      16
    );
    this.generateParticles(canvasWidth, canvasHeight);
  }

  private generateParticles(width: number, height: number) {
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: width / 2 + (Math.random() - 0.5) * 400,
        y: height / 2 - 100 + (Math.random() - 0.5) * 200,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: Math.random() * 100,
        maxLife: 100,
      });
    }
  }

  update(kwargs: EventDepSpriteKwargs) {
    if (!this.visible || !kwargs.eventState) return;
    this.startButton.update(kwargs.eventState);

    this.titleScale += 0.001 * this.titleScaleDirection;
    if (this.titleScale > 1.05 || this.titleScale < 0.95) {
      this.titleScaleDirection *= -1;
    }

    for (const particle of this.particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 1;
      if (particle.life <= 0) {
        particle.life = particle.maxLife;
        particle.x = window.innerWidth / 2 + (Math.random() - 0.5) * 400;
        particle.y = window.innerHeight / 2 - 100 + (Math.random() - 0.5) * 200;
      }
    }
  }

  resize(width: number, height: number) {
    this.startButton.rect = new Rect(
      width / 2 - 140,
      height / 2 + 80,
      Math.min(280, width / 5),
      Math.max(70, height / 12)
    );
    this.particles = [];
    this.generateParticles(width, height);
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.visible) return;

    ctx.save();

    const overlayGradient = ctx.createRadialGradient(
      ctx.canvas.width / 2,
      ctx.canvas.height / 2,
      0,
      ctx.canvas.width / 2,
      ctx.canvas.height / 2,
      ctx.canvas.width / 2
    );
    overlayGradient.addColorStop(0, "rgba(0,0,0,0.7)");
    overlayGradient.addColorStop(1, "rgba(0,0,0,0.9)");
    ctx.fillStyle = overlayGradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const particle of this.particles) {
      ctx.globalAlpha = (particle.life / particle.maxLife) * 0.3;
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.save();
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2 - 120);
    ctx.scale(this.titleScale, this.titleScale);

    ctx.font = "bold 96px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.shadowBlur = 30;
    ctx.shadowColor = "#fbbf24";

    const gradient = ctx.createLinearGradient(0, -48, 0, 48);
    gradient.addColorStop(0, "#fbbf24");
    gradient.addColorStop(0.5, "#f59e0b");
    gradient.addColorStop(1, "#fbbf24");
    ctx.fillStyle = gradient;
    ctx.fillText("CALL BREAK", 0, 0);
    ctx.restore();

    ctx.font = "28px system-ui";
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "A Classic Card Game",
      ctx.canvas.width / 2,
      ctx.canvas.height / 2 - 30
    );

    ctx.font = "16px system-ui";
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.fillText(
      "Bid wisely and win tricks to score points",
      ctx.canvas.width / 2,
      ctx.canvas.height / 2 + 10
    );

    this.startButton.draw(ctx);
    ctx.restore();
  }
}
