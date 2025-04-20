import { beforeEach, describe, expect, it, vi } from "vitest";
import { BarsProps } from "../../../src/components/BarChart/Bars/types/BarsProps";
import { mockStore } from "../../setupTests";
import Bars from "../../../src/components/BarChart/Bars/Bars";
import ReactThreeTestRenderer from "@react-three/test-renderer";
import React from "react";
import * as THREE from "three";
import { AveragePlaneProps } from "../../../src/components/Planes/props/AveragePlaneProps";
import AveragePlane from "../../../src/components/Planes/AveragePlane";

vi.mock("react-redux", () => ({
  ...vi.importActual("react-redux"),
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}));

describe("AveragePlane", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("Renderizza average plane senza crashare", async () => {
    const mockProp: AveragePlaneProps = {
      isVisible: true,
      position: new THREE.Vector3(0, 0, 0),
      size: [1, 1],
    };
    const renderer = await ReactThreeTestRenderer.create(
      <AveragePlane {...mockProp} />,
    );
    expect(renderer).toBeTruthy();
  });
});
