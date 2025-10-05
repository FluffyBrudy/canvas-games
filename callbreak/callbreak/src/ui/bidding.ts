import type { EventDepSpriteKwargs } from "../types/types.type";
import { Rect } from "../core/rect";
import { Button } from "./component/button";
import { RANKLEN } from "../constants";

export class BiddingUI {
  private width: number;
  private height: number;
  private selectedBid: number | null = null;
  private buttons: Button[] = [];
  private rect: Rect;
  private callback?: (bid: number) => void;
  private pulseScale = 1;
  private pulseDirection = 1;

  constructor(width: number, height: number, callback?: (bid: number) => void) {
    this.width = width;
    this.height = height;
    this.callback = callback;
    this.rect = new Rect(0, 0, width, height);
    this.rect.center = { x: width / 2, y: height / 2 };
    this.buildButtons();
  }

  getBid() {
    return this.selectedBid;
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.rect.width = width;
    this.rect.height = height;
    this.rect.center = { x: width / 2, y: height / 2 };

    this.buildButtons();
  }

  private buildButtons() {
    this.buttons = [];

    const panelWidth = Math.min(this.width * 0.9, 900);
    let buttonWidth = Math.floor(panelWidth / RANKLEN) - 8;

    const minSize = 40;
    if (buttonWidth < minSize) buttonWidth = minSize;

    const buttonHeight = buttonWidth;
    const spacing = 8;
    const totalWidth = RANKLEN * (buttonWidth + spacing) - spacing;

    const rowRect = new Rect(0, 0, totalWidth, buttonHeight);
    rowRect.center = { x: this.rect.center.x, y: this.rect.center.y + 60 };

    for (let i = 0; i < RANKLEN; i++) {
      const rect = new Rect(
        rowRect.x + i * (buttonWidth + spacing),
        rowRect.y,
        buttonWidth,
        buttonHeight
      );
      this.buttons.push(
        new Button(
          rect,
          (i + 1).toString(),
          () => {
            this.selectedBid = i + 1;
            if (this.callback) {
              this.callback(this.selectedBid);
            }
          },
          Math.max(16, Math.floor(buttonWidth / 2.5))
        )
      );
    }
  }

  update(kwargs?: EventDepSpriteKwargs) {
    if (!kwargs?.eventState) return;
    for (const button of this.buttons) {
      button.update(kwargs.eventState);
    }

    this.pulseScale += 0.002 * this.pulseDirection;
    if (this.pulseScale > 1.03 || this.pulseScale < 0.97) {
      this.pulseDirection *= -1;
    }
  }

  draw(ctx: CanvasRenderingContext2D, text = "") {
    ctx.save();

    const overlayGradient = ctx.createRadialGradient(
      this.width / 2,
      this.height / 2,
      0,
      this.width / 2,
      this.height / 2,
      this.width / 2
    );
    overlayGradient.addColorStop(0, "rgba(15, 23, 42, 0.85)");
    overlayGradient.addColorStop(1, "rgba(0, 0, 0, 0.95)");
    ctx.fillStyle = overlayGradient;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.save();
    ctx.translate(this.width / 2, this.height / 2 - 100);
    ctx.scale(this.pulseScale, this.pulseScale);

    ctx.font = "bold 56px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.shadowBlur = 20;
    ctx.shadowColor = "#fbbf24";

    const gradient = ctx.createLinearGradient(0, -28, 0, 28);
    gradient.addColorStop(0, "#fbbf24");
    gradient.addColorStop(0.5, "#f59e0b");
    gradient.addColorStop(1, "#fbbf24");
    ctx.fillStyle = gradient;
    ctx.fillText("Place Your Bid", 0, 0);
    ctx.restore();

    ctx.font = "bold 24px system-ui";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.fillText(
      `${text}: How many tricks will you win?`,
      this.width / 2,
      this.height / 2 - 30
    );
    ctx.shadowBlur = 0;

    for (const button of this.buttons) {
      button.draw(ctx);
    }

    ctx.restore();
  }
}
