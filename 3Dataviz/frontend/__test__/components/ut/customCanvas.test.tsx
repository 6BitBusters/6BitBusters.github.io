import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "@testing-library/react";
import CustomCanvas from "../../../src/components/customCanvas/customCanvas";
import React from "react";
import Lights from "../../../src/components/customCanvas/lights";
import { LightsProp } from "../../../src/components/customCanvas/props/lightsProp";
import ReactThreeTestRenderer from "@react-three/test-renderer";

describe("CustomCanvas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Lights", () => {
    it("Verifica che la renderizzazione delle luci avvenga senza generare errori o causare un crash dell'applicazione.", async () => {
      const mockProp: LightsProp = {
        intensity: 1,
        lightPosition: [0, 0, 0],
      };
      const renderer = await ReactThreeTestRenderer.create(
        <Lights {...mockProp} />,
      );
      expect(renderer).toBeTruthy();
    });
  });

  it("Verifica che la renderizzazione del custom canvas avvenga senza generare errori o causare un crash dell'applicazione.", () => {
    const { container } = render(<CustomCanvas />);
    expect(container).toBeTruthy();
  });
});
