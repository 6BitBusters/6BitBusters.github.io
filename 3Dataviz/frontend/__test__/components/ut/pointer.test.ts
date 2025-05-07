import { describe, test, expect, vi } from "vitest";
import * as THREE from "three";
import { UpdateMousePosition } from "../../../src/components/barChart/bars/utils/pointerInterectionUtils";

describe("PointerInterractionUtils", () => {
  describe("UpdateMousePosition", () => {
    test("Verifica che, fornendo un canvas valido e un evento mouse, le proprietà mouse.x e mouse.y vengano aggiornate correttamente con le coordinate del puntatore all'interno del canvas.", () => {
      const mockMouse = new THREE.Vector2(3, 3);
      const mockCanvas = document.createElement("canvas");
      const mockEvent = {
        clientX: 50,
        clientY: 40,
        target: mockCanvas,
        altKey: false,
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        button: 0,
        buttons: 1,
        relatedTarget: null,
        offsetX: 40, // Aggiungi alcune proprietà comuni
        offsetY: 20,
        pageX: 60,
        pageY: 60,
        screenX: 70,
        screenY: 80,
        type: "mousemove",
        bubbles: true,
        cancelable: true,
        composed: true,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        stopImmediatePropagation: vi.fn(),
      } as unknown as MouseEvent;

      UpdateMousePosition(mockMouse, mockEvent);

      // Calcoli attesi per mouse.x
      const expectedMouseX =
        ((mockEvent.clientX - mockCanvas.getBoundingClientRect().left) /
          mockCanvas.getBoundingClientRect().width) *
          2 -
        1;
      expect(mockMouse.x).toBe(expectedMouseX);

      // Calcoli attesi per mouse.y
      const expectedMouseY =
        -(
          (mockEvent.clientY - mockCanvas.getBoundingClientRect().top) /
          mockCanvas.getBoundingClientRect().height
        ) *
          2 +
        1;
      expect(mockMouse.y).toBeCloseTo(expectedMouseY);
    });

    test("Verifica che la posizione del mouse (mouse.x e mouse.y) non venga aggiornata se l'elemento target dell'evento non è un HTMLCanvasElement.", () => {
      const mockMouse = new THREE.Vector2(0.5, 0.8);
      const mockNonCanvas = {} as EventTarget;
      const mockEvent = {
        clientX: 100,
        clientY: 50,
        target: mockNonCanvas,
      } as MouseEvent;

      UpdateMousePosition(mockMouse, mockEvent);

      // Verifica che i valori di mouse non siano cambiati (o siano rimasti vicini a quelli iniziali)
      expect(mockMouse.x).toBeCloseTo(0.5);
      expect(mockMouse.y).toBeCloseTo(0.8);
    });
  });
});
