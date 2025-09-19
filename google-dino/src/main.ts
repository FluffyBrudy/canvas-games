import "./style.css";
import { Game } from "./game";

function main() {
  const game = new Game();
  game.handleEvent();

  window.addEventListener("resize", () => {
    game.onResize();
  });

  const animate = () => {
    game.clearScreen();
    game.update();
    game.draw();
    requestAnimationFrame(animate);
  };

  animate();
}

main();
