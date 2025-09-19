import "./style.css";
import { Game } from "./game";

function main() {
  const game = new Game();
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
