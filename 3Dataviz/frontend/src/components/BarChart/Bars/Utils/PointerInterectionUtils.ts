import * as THREE from "three";

export function UpdateMousePosition(mouse:THREE.Vector2, event: MouseEvent) {
    const canvas = event.target as HTMLCanvasElement;
    if (canvas instanceof HTMLCanvasElement) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }
  };