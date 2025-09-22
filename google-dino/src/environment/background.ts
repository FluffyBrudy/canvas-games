export class Background {
  private image: HTMLImageElement;
  private x: number;
  private y: number;
  private scroll: number;

  constructor(x: number, y: number, image: HTMLImageElement) {
    this.image = image;
    console.log(this.image.width);
    this.x = x;
    this.y = y;
    this.scroll = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const scroll = this.scroll;
    const imWidth = this.image.width;
    const imHeight = this.image.height;
    const x = this.x;
    const y = this.y;
    const croppedWidth = imWidth - scroll;

    ctx.drawImage(
      this.image,
      scroll,
      0,
      croppedWidth,
      imHeight,
      x,
      y,
      croppedWidth,
      imHeight
    );
    const drawX = x + croppedWidth;
    const viewportWidth = ctx.canvas.width;
    /*
     *  Remainder: I ommited left edge case when drawX get negative since interval is *0 <= drawX < viewportWidth* because in update i immidiately reset
     *  if it goes beyond imageMwidth
     */
    if (drawX < viewportWidth) {
      ctx.drawImage(
        this.image,
        0,
        0,
        scroll,
        imHeight,
        x + croppedWidth,
        y,
        scroll,
        imHeight
      );
    }
  }

  getHeight() {
    return this.image.height;
  }

  update(delta: number, playerSpeed: number) {
    this.scroll += playerSpeed * delta;
    if (this.scroll > this.image.width) this.scroll = 0;
  }
}
