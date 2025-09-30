import type { EventDepSpriteKwargs } from "../types/types.type";
import { Rect } from "../core/rect";
import { Button } from "./component/button";

export class BiddingUI {
  private width: number;
  private height: number;
  private selectedBid: number | null = null;
  private buttons: Button[] = [];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.buildButtons();
  }

  getBid() {
    return this.selectedBid;
  }

  private buildButtons() {
    this.buttons = [];
    const buttonWidth = 50;
    const buttonHeight = 50;
    const spacing = 10;
    const totalWidth = 13 * (buttonWidth + spacing) - spacing;

    const rowRect = new Rect(0, 0, totalWidth, buttonHeight);
    rowRect.center = { x: this.width / 2, y: this.height / 2 + 40 };

    for (let i = 0; i < 13; i++) {
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
          },
          8
        )
      );
    }
  }

  update(kwargs?: EventDepSpriteKwargs) {
    if (!kwargs?.eventState) return;
    for (const button of this.buttons) {
      button.update(kwargs.eventState);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.font = "bold 48px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffd700";
    ctx.fillText("Place Your Bid", this.width / 2, this.height / 2 - 100);

    ctx.font = "20px system-ui";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(
      "How many tricks will you win?",
      this.width / 2,
      this.height / 2 - 50
    );

    for (const button of this.buttons) {
      button.draw(ctx);
    }

    ctx.restore();
  }
}
