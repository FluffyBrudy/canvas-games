export function loadImages(paths: string[]) {
  const frames = paths.map((frame) => {
    const img = new Image();
    img.src = frame;
    return img;
  });
  return frames;
}

export type ImagePixels = { data: Uint8ClampedArray; w: number; h: number };

export function getImageColorUint8Array(
  image: HTMLImageElement,
  scaleOrSize: number | { w: number; h: number } = 1
): ImagePixels {
  const imCanvas = document.createElement("canvas");
  const ctx = imCanvas.getContext("2d")!;
  if (typeof scaleOrSize === "number") {
    imCanvas.width = Math.max(1, ~~(image.width * scaleOrSize));
    imCanvas.height = Math.max(1, ~~(image.height * scaleOrSize));
  } else {
    imCanvas.width = Math.max(1, ~~scaleOrSize.w);
    imCanvas.height = Math.max(1, ~~scaleOrSize.h);
  }
  ctx.drawImage(image, 0, 0, imCanvas.width, imCanvas.height);
  const data = ctx.getImageData(0, 0, imCanvas.width, imCanvas.height).data;
  return { data, w: imCanvas.width, h: imCanvas.height };
}

export async function loadImageAsync(paths: string[] | string) {
  if (!Array.isArray(paths)) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      console.log(paths);
      const img = new Image();
      img.src = paths;
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("failed to load image"));
    });
  }
  const promises = paths.map((path) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.src = path;
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("failed to load"));
    });
  });
  return Promise.all(promises);
}

export async function loadAllAssets<
  T = Record<string, string | string[] | Record<string, any>>
>(registry: T) {
  if (typeof registry === "string") {
    return await loadImageAsync(registry);
  } else if (Array.isArray(registry)) {
    return await loadImageAsync(registry);
  } else {
    const res = {} as any;
    for (let key in registry) {
      res[key] = await loadAllAssets((registry as T)[key]);
    }
    return res;
  }
}

export type Rect = { x: number; y: number; w: number; h: number };
export function rectCollision(a: Rect, b: Rect) {
  return (
    a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h
  );
}

type SpriteAndRect = object & {
  rect: Rect;
  pix: ImagePixels;
};
export type SpriteWithRectAndImage<T extends SpriteAndRect> = T;

export function pixelPerfectCollision<
  T1 extends SpriteAndRect,
  T2 extends SpriteAndRect
>(a: SpriteWithRectAndImage<T1>, b: SpriteWithRectAndImage<T2>) {
  const aRect = a.rect;
  const bRect = b.rect;
  if (!rectCollision(aRect, bRect)) return false;
  console.log("coll");
  const overlapLeft = Math.floor(Math.max(aRect.x, bRect.x));
  const overlapRight = Math.ceil(
    Math.min(aRect.x + aRect.w, bRect.x + bRect.w)
  );
  const overlapTop = Math.floor(Math.max(aRect.y, bRect.y));
  const overlapBottom = Math.ceil(
    Math.min(aRect.y + aRect.h, bRect.y + bRect.h)
  );

  for (let y = overlapTop; y < overlapBottom; y++) {
    for (let x = overlapLeft; x < overlapRight; x++) {
      const [ax, ay] = [x - aRect.x, y - aRect.y];
      const [bx, by] = [x - bRect.x, y - bRect.y];

      const aPixX = Math.floor((ax / aRect.w) * a.pix.w);
      const aPixY = Math.floor((ay / aRect.h) * a.pix.h);
      const bPixX = Math.floor((bx / bRect.w) * b.pix.w);
      const bPixY = Math.floor((by / bRect.h) * b.pix.h);

      const aAlpha = a.pix.data[(aPixY * a.pix.w + aPixX) * 4 + 3];
      const bAlpha = b.pix.data[(bPixY * b.pix.w + bPixX) * 4 + 3];

      if (aAlpha > 0 && bAlpha > 0) {
        return true;
      }
    }
  }
  return false;
}
