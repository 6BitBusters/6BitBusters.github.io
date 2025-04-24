import { beforeEach, describe, expect, it, vi } from "vitest";
import ReactThreeTestRenderer from "@react-three/test-renderer";
import React from "react";
import * as THREE from "three";
import { averagePlaneProps } from "../../../src/components/planes/props/averagePlaneProps";
import AveragePlane from "../../../src/components/planes/averagePlane";

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
    const mockProp: averagePlaneProps = {
      position: new THREE.Vector3(0, 0, 0),
      size: [1, 1],
    };
    const renderer = await ReactThreeTestRenderer.create(
      <AveragePlane {...mockProp} />,
    );
    expect(renderer).toBeTruthy();
  });
});
