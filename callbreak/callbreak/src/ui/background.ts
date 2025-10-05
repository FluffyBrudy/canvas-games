export class Background {
  private width = 0;
  private height = 0;
  private lastUpdate = 0;
  private interval = 16;
  private stars: {
    x: number;
    y: number;
    r: number;
    dx: number;
    dy: number;
    opacity: number;
    twinkleSpeed: number;
  }[] = [];
  private particles: {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    hue: number;
  }[] = [];

  constructor() {
    this.generateStars(150);
    this.generateParticles(30);
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.stars = [];
    this.particles = [];
    this.generateStars(150);
    this.generateParticles(30);
  }

  private generateStars(count: number) {
    for (let i = 0; i < count; i++) {
      this.stars.push(this.createStar());
    }
  }

  private generateParticles(count: number) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        hue: Math.random() * 60 + 180,
      });
    }
  }

  private createStar() {
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      r: Math.random() * 2.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.5 + 0.5,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
    };
  }

  private updatePositions() {
    for (const star of this.stars) {
      star.x += star.dx;
      star.y += star.dy;
      star.opacity += star.twinkleSpeed;
      if (star.opacity > 1 || star.opacity < 0.3) {
        star.twinkleSpeed *= -1;
      }

      if (star.x < 0) star.x = this.width;
      if (star.x > this.width) star.x = 0;
      if (star.y < 0) star.y = this.height;
      if (star.y > this.height) star.y = 0;
    }

    for (const particle of this.particles) {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < 0) particle.x = this.width;
      if (particle.x > this.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.height;
      if (particle.y > this.height) particle.y = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D, now: number) {
    if (now - this.lastUpdate > this.interval) {
      this.updatePositions();
      this.lastUpdate = now;
    }

    const gradient = ctx.createLinearGradient(0, 0, this.width, this.height);
    gradient.addColorStop(0, "#0f172a");
    gradient.addColorStop(0.5, "#1e293b");
    gradient.addColorStop(1, "#0f172a");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);

    for (const particle of this.particles) {
      ctx.save();
      ctx.globalAlpha = 0.3;
      const particleGradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.size * 3
      );
      particleGradient.addColorStop(0, `hsla(${particle.hue}, 70%, 60%, 0.8)`);
      particleGradient.addColorStop(1, `hsla(${particle.hue}, 70%, 60%, 0)`);
      ctx.fillStyle = particleGradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    for (const star of this.stars) {
      ctx.save();
      ctx.globalAlpha = star.opacity;
      ctx.fillStyle = "white";
      ctx.shadowBlur = 4;
      ctx.shadowColor = "white";
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}
