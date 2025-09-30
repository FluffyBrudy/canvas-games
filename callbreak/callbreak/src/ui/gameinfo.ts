export class GameInfoUI {
  private width: number;
  private height: number;

  private currentRound = 1;
  private totalRounds = 13;
  private currentPlayerLabel = "";

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  setRound(round: number, total: number) {
    this.currentRound = round;
    this.totalRounds = total;
  }

  setCurrentPlayer(label: string) {
    this.currentPlayerLabel = label;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();

    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, this.width, 60);

    ctx.font = "bold 24px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffd700";
    ctx.fillText(
      `Round ${this.currentRound} / ${this.totalRounds}`,
      this.width / 2,
      30
    );

    if (this.currentPlayerLabel) {
      ctx.font = "18px system-ui";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(
        `${this.currentPlayerLabel}'s Turn`,
        this.width / 2,
        this.height - 30
      );
    }

    ctx.restore();
  }
}
