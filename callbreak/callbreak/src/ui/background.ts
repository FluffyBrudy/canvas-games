export class Background {
  private width = 0;
  private height = 0;

  private lastUpdate = 0;
  private interval = 0;
  private stars: { x: number; y: number; r: number; dx: number; dy: number }[] =
    [];

  constructor() {
    this.generateStars(100);
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.stars = [];
    this.generateStars(100);
  }

  private generateStars(count: number) {
    for (let i = 0; i < count; i++) {
      this.stars.push(this.createStar());
    }
  }

  private createStar() {
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
    };
  }

  private updatePositions() {
    for (let star of this.stars) {
      star.x += star.dx;
      star.y += star.dy;

      if (star.x < 0) star.x = this.width;
      if (star.x > this.width) star.x = 0;
      if (star.y < 0) star.y = this.height;
      if (star.y > this.height) star.y = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D, now: number) {
    if (now - this.lastUpdate > this.interval) {
      this.updatePositions();
      this.lastUpdate = now;
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, "#0a0f1f");
    gradient.addColorStop(1, "#1c1f3a");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = "white";
    for (let star of this.stars) {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
