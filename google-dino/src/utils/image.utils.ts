export function loadImages(paths: string[]) {
  const frames = paths.map((frame) => {
    const img = new Image();
    img.src = frame;
    return img;
  });
  return frames;
}
