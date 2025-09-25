type Tsize = { w: number; h: number };
type TSizeOrScale = Tsize | number;

export class ImageObj {
  private _image: HTMLImageElement;
  private loaded = false;
  private size: Tsize;

  constructor(path: string, size: TSizeOrScale = 1) {
    this._image = new Image();
    this._image.src = path;
    this.size = { w: 0, h: 0 };
    this.sizeOrScale = size;
  }

  private sizeOrScale: TSizeOrScale;

  async load() {
    await this._image.decode();

    if (typeof this.sizeOrScale === "number") {
      this.size = {
        w: Math.round(this._image.width * this.sizeOrScale),
        h: Math.round(this._image.height * this.sizeOrScale),
      };
    } else {
      this.size = { ...this.sizeOrScale };
    }

    if (
      this.size.w !== this._image.width ||
      this.size.h !== this._image.height
    ) {
      this._image = await this.scaleImage(this._image, this.size);
    }
    this.loaded = true;
  }

  private async scaleImage(
    image: HTMLImageElement,
    size: Tsize
  ): Promise<HTMLImageElement> {
    const canvas = document.createElement("canvas");
    canvas.width = size.w;
    canvas.height = size.h;
    const ctx = canvas.getContext("2d")!;

    await image.decode();

    ctx.drawImage(image, 0, 0, size.w, size.h);

    const scaledImage = new Image();
    scaledImage.src = canvas.toDataURL();

    await scaledImage.decode();

    return scaledImage;
  }

  get image() {
    return this._image;
  }

  getSize(): Tsize {
    return this.size;
  }

  isLoaded(): boolean {
    return this.loaded;
  }
}
