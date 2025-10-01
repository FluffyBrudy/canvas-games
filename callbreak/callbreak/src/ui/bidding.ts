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

    const panelWidth = Math.min(this.width * 0.8, 800);
    let buttonWidth = Math.floor(panelWidth / RANKLEN);

    const minSize = 30;
    if (buttonWidth < minSize) buttonWidth = minSize;

    const buttonHeight = buttonWidth;
    const spacing = 1;
    const totalWidth = RANKLEN * (buttonWidth + spacing) - spacing;

    const rowRect = new Rect(0, 0, totalWidth, buttonHeight);
    rowRect.center = { x: this.rect.center.x, y: this.rect.center.y + 40 };

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
          Math.max(12, Math.floor(buttonWidth / 3))
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

  draw(ctx: CanvasRenderingContext2D, text = "") {
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
      `${text}: How many tricks will you win?`,
      this.width / 2,
      this.height / 2 - 50
    );

    for (const button of this.buttons) {
      button.draw(ctx);
    }

    ctx.restore();
  }
}
