import "./style.css";
import { CustomEvent } from "./core/event";
import { AIHandSprite, PlayerHandSprite } from "./entity/player/view";
import { getCardAlignment, preload } from "./systems/assets-loader";

import { Game } from "./game";
import { shuffle } from "./utils/game-utils";

async function main() {
  const canvas = document.querySelector("canvas")!;
  const event = new CustomEvent(canvas);
  const ctx = canvas.getContext("2d")!;

  const resizeCallback = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    Game.background.resize(canvas.width, canvas.height);
  };
  window.addEventListener("load", resizeCallback, { once: true });
  window.addEventListener("resize", resizeCallback);

  await preload();

  const { alignmentRectMap, stackAlignment } = getCardAlignment();

  const players = (
    Object.keys(alignmentRectMap) as Array<keyof typeof alignmentRectMap>
  ).map((alignment) => {
    if (alignment === "midbottom") {
      return new PlayerHandSprite(
        alignmentRectMap[alignment],
        alignment,
        stackAlignment[alignment]
      );
    } else {
      return new AIHandSprite(
        alignmentRectMap[alignment],
        alignment,
        stackAlignment[alignment]
      );
    }
  });
  shuffle(players);

  const game = new Game(players);

  const animate = (ts: number) => {
    const eventStateSnapshot = Object.freeze(event.getState());
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    game.update(ts, { eventState: eventStateSnapshot });
    game.draw(ctx);
    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
}

main();
