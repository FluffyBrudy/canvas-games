import type { Rect } from "../../core/rect";
import type { InputState } from "../../types/types.type";

export class Button {
  rect: Rect;
  label: string;
  radius: number;
  onClick: () => void;
  hover = false;
  private scale = 1;
  private targetScale = 1;

  constructor(rect: Rect, label: string, onClick: () => void, radius = 8) {
    this.rect = rect;
    this.label = label;
    this.onClick = onClick;
    this.radius = radius;
  }

  update(eventState: InputState) {
    const { mouseX, mouseY, leftPressed } = eventState;
    this.hover = this.rect.collidepoint(mouseX, mouseY);

    this.targetScale = this.hover ? (leftPressed ? 0.95 : 1.05) : 1;
    this.scale += (this.targetScale - this.scale) * 0.2;

    if (this.hover && leftPressed) {
      this.onClick();
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();

    ctx.translate(this.rect.center.x, this.rect.center.y);
    ctx.scale(this.scale, this.scale);
    ctx.translate(-this.rect.center.x, -this.rect.center.y);

    const gradient = ctx.createLinearGradient(
      this.rect.x,
      this.rect.y,
      this.rect.x,
      this.rect.y + this.rect.height
    );

    if (this.hover) {
      gradient.addColorStop(0, "#fbbf24");
      gradient.addColorStop(1, "#f59e0b");
      ctx.shadowBlur = 20;
      ctx.shadowColor = "rgba(251, 191, 36, 0.6)";
    } else {
      gradient.addColorStop(0, "#10b981");
      gradient.addColorStop(1, "#059669");
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(16, 185, 129, 0.4)";
    }

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(
      this.rect.x,
      this.rect.y,
      this.rect.width,
      this.rect.height,
      this.radius
    );
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.font = `bold ${Math.max(16, this.rect.height / 3.5)}px system-ui`;
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.label, this.rect.center.x, this.rect.center.y);
    ctx.restore();
  }
}
