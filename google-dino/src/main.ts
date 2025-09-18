import { CanvasInterface } from "./interface";

function main() {
  const canvasInterface = new CanvasInterface();

  window.addEventListener("resize", () => {
    canvasInterface.onResize();
  });

  const animate = () => {
    canvasInterface.clearScreen();
    requestAnimationFrame(animate);
  };

  animate();
}

main();
