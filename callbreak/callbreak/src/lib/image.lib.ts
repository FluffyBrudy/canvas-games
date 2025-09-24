/**
 * modify attributes `width` and `height` at your own risk
 */
export class ImageObj extends Image {
  private pixels: Uint8ClampedArray | null = null;
  private loaded = false;

  constructor(path: string, size: { w: number; h: number } | number = 1) {
    super();

    this.src = path;
    this.onload = () => {
      if (typeof size === "number") {
        this.width = ~~(this.width * size);
        this.height = ~~(this.height * size);
      } else {
        this.width = size.w;
        this.height = size.h;
      }
      this.loaded = true;
      retriveImgColorArray(this);
    };
  }

  public isLoaded() {
    return this.loaded;
  }

  public getPixels() {
    return this.pixels;
  }
}

function retriveImgColorArray(image: ImageObj): Uint8ClampedArray {
  const imcanvas = document.createElement("canvas");
  imcanvas.width = image.width;
  imcanvas.height = image.height;
  const ctx = imcanvas.getContext("2d")!;
  ctx.fillStyle = "rgba(0, 0, 0, 0)";
  ctx.drawImage(image, 0, 0, imcanvas.width, imcanvas.height);
  return ctx.getImageData(0, 0, imcanvas.width, imcanvas.height).data;
}
