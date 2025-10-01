import { Rect } from "../../core/rect";
import type { InputState } from "../../types/types.type";

export class Button {
  rect: Rect;
  label: string;
  radius: number;
  onClick: () => void;
  hover = false;

  constructor(rect: Rect, label: string, onClick: () => void, radius = 8) {
    this.rect = rect;
    this.label = label;
    this.onClick = onClick;
    this.radius = radius;
  }

  update(eventState: InputState) {
    const { mouseX, mouseY, leftPressed } = eventState;
    this.hover = this.rect.collidepoint(mouseX, mouseY);
    if (this.hover && leftPressed) {
      this.onClick();
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = this.hover ? "#45a049" : "#4CAF50";
    ctx.beginPath();
    ctx.roundRect(
      this.rect.x,
      this.rect.y,
      this.rect.width,
      this.rect.height,
      this.radius
    );
    ctx.fill();

    ctx.font = "bold 20px system-ui";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.label, this.rect.center.x, this.rect.center.y);
    ctx.restore();
  }
}
