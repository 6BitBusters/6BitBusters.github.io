import { beforeEach, describe, expect, it, vi } from "vitest";
import { BarsProps } from "../../../src/components/BarChart/Bars/props/BarsProps";
import { mockStore } from "../../setupTests";
import Bars from "../../../src/components/BarChart/Bars/Bars";
import ReactThreeTestRenderer from "@react-three/test-renderer";
import React from "react";

vi.mock("react-redux", () => ({
  ...vi.importActual("react-redux"),
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}));

describe("Bars", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("Renderizza le barre senza crashare", async () => {
    const mockProp: BarsProps = {
      clickHandler: vi.fn(),
      hoverHandler: vi.fn(),
      data: mockStore.getState().data.data,
    };
    const renderer = await ReactThreeTestRenderer.create(
      <Bars {...mockProp} />,
    );
    expect(renderer).toBeTruthy();
  });
});
