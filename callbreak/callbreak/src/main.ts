import { preload, SuitImages } from "./systems/assets-loader";
import { Rank, Suit } from "./constants";
import { Card } from "./models/card";
import "./style.css";
import { CustomEvent } from "./core/event";

async function main() {
  const canvas = document.querySelector("canvas")!;
  const event = new CustomEvent(canvas);

  const resizeCallback = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener("load", resizeCallback, { once: true });
  window.addEventListener("resize", resizeCallback);

  const ctx = canvas.getContext("2d")!;

  await preload();

  const card = new Card(Rank.ACE, Suit.CLUB, 0, 0, SuitImages.club);

  const animate = () => {
    const stateSnapshot = Object.freeze(event.getState());
    card.draw(ctx);
    card.update(stateSnapshot);
    requestAnimationFrame(animate);
  };

  animate();
}

main();
