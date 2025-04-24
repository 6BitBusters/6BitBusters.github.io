import { beforeEach, describe, expect, it, vi } from "vitest";
import ReactThreeTestRenderer from "@react-three/test-renderer";
import React from "react";
import { TooltipProps } from "../../../src/components/barChart/bars/props/tooltipProps";
import Tooltip from "../../../src/components/barChart/bars/tooltip";
import { createMockRootState } from "../../utils/stateMockCreator";

vi.mock("react-redux", () => ({
  ...vi.importActual("react-redux"),
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}));

describe("ToolTip", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("Renderizza un tooltip senza crashare", async () => {
    const mockState = createMockRootState({
      data: {
        data: [
          { id: 0, show: true, x: 1, y: 54, z: 1 },
          { id: 1, show: true, x: 1, y: 24, z: 2 },
          { id: 2, show: true, x: 2, y: 32, z: 4 },
          { id: 3, show: true, x: 3, y: 14, z: 1 },
          { id: 4, show: true, x: 2, y: 21, z: 3 },
          { id: 5, show: true, x: 6, y: 43, z: 3 },
        ],
        legend: { x: "Citta", z: "Ora", y: "Temperatura" },
        average: 0,
        x: [
          "Madrid",
          "Parigi",
          "Milano",
          "Guanabo",
          "Londra",
          "Venezia",
          "Roma",
          "Tokyo",
        ],
        z: [
          "12:00",
          "13:00",
          "14:00",
          "15:00",
          "16:00",
          "17:00",
          "18:00",
          "19:00",
        ],
      },
    });
    const mockProp: TooltipProps = {
      data: mockState.data.data[0],
      legend: mockState.data.legend,
      Xlabel: mockState.data.x[1],
      Zlabel: mockState.data.z[1],
    };
    const renderer = await ReactThreeTestRenderer.create(
      <Tooltip {...mockProp} />,
    );
    expect(renderer).toBeTruthy();
  });
});
