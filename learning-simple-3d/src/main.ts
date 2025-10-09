import { Group, Rect } from "canvas-utils-lib";
import { Card } from "./card";

const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d")!;

const totalCards = 5;
const step = Math.PI / 12;
const [cx, cy] = [400, 500];
const [W, H] = [80, 100];

window.onload = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const cardGroup = new Group();

  for (let i = 0; i < totalCards; i++) {
    const angle = (i - Math.floor(totalCards / 2)) * step;

    const rect = new Rect(cx - W / 2, cy - H, W, H);

    const color =
      "#" +
      (Math.floor(Math.random() * 0xffffff) + 1).toString(16).padStart(6, "0");

    const card = new Card(rect, color, angle - Math.PI / 2);
    cardGroup.add(card);
  }

  function main() {
    const animate = (t: number) => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      cardGroup.update({ t });
      cardGroup.draw(ctx);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  main();
};
