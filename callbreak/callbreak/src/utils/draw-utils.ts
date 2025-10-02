export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  offsetX = 0,
  offsetY = 0,
  fontSize = 15,
  color = "rgba(255,255,255,0.5)",
  anchor: CanvasTextAlign = "center",
  baseline: CanvasTextBaseline = "middle"
) {
  ctx.save();

  ctx.font = fontSize + "px monospace";
  ctx.fillStyle = color;
  ctx.textAlign = anchor;
  ctx.textBaseline = baseline;
  ctx.fillText(text, x + offsetX, y + offsetY);
  ctx.restore();
}
