import { preload } from "./systems/assets-loader";
import { Rank, Suit } from "./constants";
import { CardSprite } from "./entity/card/view";
import { CardModel } from "./entity/card/model";
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

  const card = new CardSprite(new CardModel(Rank.ACE, Suit.HEART), 0, 0);

  const animate = () => {
    const stateSnapshot = Object.freeze(event.getState());
    card.draw(ctx);
    card.update(stateSnapshot);
    requestAnimationFrame(animate);
  };

  animate();
}

main();
