export function loadImages(paths: string[]) {
  const frames = paths.map((frame) => {
    const img = new Image();
    img.src = frame;
    return img;
  });
  return frames;
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
