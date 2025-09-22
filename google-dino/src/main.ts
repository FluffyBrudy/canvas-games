import "./style.css";
import { Game } from "./game";
import { loadAllAssets } from "./utils/image.utils";
import { ASSETS } from "./constants";

async function main() {
  const assets = await loadAllAssets(ASSETS);
  const game = new Game(assets);
  game.handleEvent();

  let lastTime = 0;

  window.addEventListener("resize", () => {
    game.onResize();
  });

  const animate = (time: number) => {
    const delta = (time - lastTime) / 1000;
    lastTime = time;
    game.clearScreen();
    game.update(delta);
    game.draw();

    requestAnimationFrame(animate);
  };

  animate(lastTime);
}

main();
