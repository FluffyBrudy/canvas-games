import { Rect } from "../core/rect";
import { Button } from "./component/button";
import type { EventDepSpriteKwargs } from "../types/types.type";

export class MenuUI {
  private startButton: Button;
  public visible = true;

  constructor(canvasWidth: number, canvasHeight: number, onStart: () => void) {
    const btnRect = new Rect(
      canvasWidth / 2 - 120,
      canvasHeight / 2 + 40,
      240,
      60
    );
    this.startButton = new Button(
      btnRect,
      "START GAME",
      () => {
        this.visible = false;
        onStart();
      },
      12
    );
  }

  update(kwargs: EventDepSpriteKwargs) {
    if (!this.visible || !kwargs.eventState) return;
    this.startButton.update(kwargs.eventState);
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.visible) return;

    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.font = "bold 72px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffd700";
    ctx.fillText(
      "CALL BREAK",
      ctx.canvas.width / 2,
      ctx.canvas.height / 2 - 100
    );

    ctx.font = "24px system-ui";
    ctx.fillStyle = "#fff";
    ctx.fillText(
      "A Classic Card Game",
      ctx.canvas.width / 2,
      ctx.canvas.height / 2 - 40
    );

    this.startButton.draw(ctx);
    ctx.restore();
  }
}
