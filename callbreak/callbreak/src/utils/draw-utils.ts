export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  offsetX = 0,
  offsetY = 0,
  color = "rgba(255,255,255,0.5)",
  fontSize = 15,
  anchor: "center" | "left" | "right" | "end" | "start" = "center"
) {
  ctx.save();

  ctx.fillStyle = color;
  ctx.textAlign = anchor;
  ctx.textBaseline = "top";
  ctx.font = fontSize + "px monospace";

  ctx.fillText(text, x + offsetX, y + offsetY);

  ctx.restore();
}
