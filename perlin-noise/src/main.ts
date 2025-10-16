import { perlinNoise, perlinNoise1D } from "./lib/pnoise";
import "./style.css";

const canvas = document.getElementsByTagName("canvas")[0]!;
canvas.width = 200;
canvas.height = 200;
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d")!;
const width = canvas.width;
const height = canvas.height;
const imgData = ctx.createImageData(width, height);

const animate = () => {
  let xoff = 0;

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const index = (i * width + j) * 4;
      const r = perlinNoise1D(xoff) * 255;
      imgData.data[index] = r;
      imgData.data[index + 1] = r;
      imgData.data[index + 2] = r;
      imgData.data[index + 3] = 255;

      xoff += 0.01;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  requestAnimationFrame(animate);
};

requestAnimationFrame(animate);
