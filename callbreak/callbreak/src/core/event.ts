import type { InputState } from "../types/types.type";

export class CustomEvent {
  private state: InputState = {
    mouseX: -100,
    mouseY: -100,
    leftPressed: false,
    rightPressed: false,
    keysDown: new Set(),
  };

  constructor(canvas: HTMLCanvasElement) {
    canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
    canvas.addEventListener("mousemove", (e) => {
      this.state.mouseX = e.offsetX;
      this.state.mouseY = e.offsetY;
    });

    canvas.addEventListener("mousedown", (e) => {
      if (e.button === 0) this.state.leftPressed = true;
      if (e.button === 2) this.state.rightPressed = true;
    });

    canvas.addEventListener("mouseup", (e) => {
      if (e.button === 0) this.state.leftPressed = false;
      if (e.button === 2) this.state.rightPressed = false;
    });
    window.addEventListener("keydown", (e) => {
      if (!this.state.keysDown.has(e.key)) {
        this.state.keysDown.add(e.key.toLocaleLowerCase());
      }
    });
    window.addEventListener("keyup", (e) =>
      this.state.keysDown.delete(e.key.toLocaleLowerCase())
    );
  }

  getState() {
    return { ...this.state };
  }
}
