import { beforeEach, describe, expect, it, vi } from "vitest";
import { BarsProps } from "../../../src/components/BarChart/Bars/props/BarsProps";
import Bars from "../../../src/components/BarChart/Bars/Bars";
import ReactThreeTestRenderer from "@react-three/test-renderer";
import React from "react";
import { CreateMockRootState } from "../../utils/StateMockCreator";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import { RootState } from "@react-three/fiber";
import { AppDispatch } from "../../../src/app/Store";
import * as raycaster from "../../../src/components/BarChart/Bars/Utils/RaycastUtils";
import * as colors from "../../../src/components/BarChart/Bars/Utils/ColorsUtils";
import { delay } from "../../setupTests";
import * as THREE from "three";

const middlewares = [thunk];
const mockStore = configureMockStore<RootState, AppDispatch>(middlewares);

describe("Bars", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("Renderizza le barre senza crashare", async () => {
    const mockProp: BarsProps = {
      clickHandler: vi.fn(),
      hoverHandler: vi.fn(),
      data: CreateMockRootState().data.data,
    };
    const renderer = await ReactThreeTestRenderer.create(
      <Provider
        store={mockStore(
          CreateMockRootState({
            raycast: {
              barTooltipPosition: null,
              previousSelectedBarId: null,
            },
          }),
        )}>
        <Bars {...mockProp} />
      </Provider>,
    );
    expect(renderer).toBeTruthy();
  });
  it("quando si clicca sulla barra deve essere calcolata l`intersezione con il puntatore, cambiare il colore colore e chiamare il clickhandler", async () => {
    const mockProp: BarsProps = {
      clickHandler: vi.fn(),
      hoverHandler: vi.fn(),
      data: CreateMockRootState().data.data,
    };
    const selection = vi.spyOn(colors, "Selection");
    const renderer = await ReactThreeTestRenderer.create(
      <Provider
        store={mockStore(
          CreateMockRootState({
            raycast: {
              barTooltipPosition: null,
              previousSelectedBarId: null,
            },
          }),
        )}>
        <Bars {...mockProp} />,
      </Provider>,
    );

    const intersection = vi
      .spyOn(raycaster, "GetIntersectionId")
      .mockReturnValueOnce(1);
    const mesh = renderer.scene.children[0];
    await renderer.fireEvent(mesh, "click");
    expect(intersection).toHaveBeenCalled();
    expect(mockProp.clickHandler).toHaveBeenCalled();
    expect(selection).toHaveBeenCalled();
  });
  it("quando il mouse si sposta e non interseca una delle barre il tooltop non deve apparire", async () => {
    const mockProp: BarsProps = {
      clickHandler: vi.fn(),
      hoverHandler: vi.fn(),
      data: CreateMockRootState().data.data,
    };
    const renderer = await ReactThreeTestRenderer.create(
      <Provider
        store={mockStore(
          CreateMockRootState({
            raycast: {
              barTooltipPosition: null,
              previousSelectedBarId: null,
            },
          }),
        )}>
        <Bars {...mockProp} />,
      </Provider>,
    );

    const intersection = vi
      .spyOn(raycaster, "GetIntersectionId")
      .mockReturnValueOnce(1);
    const intersectionPoint = vi.spyOn(raycaster, "GetIntersection");
    const mesh = renderer.scene.children[0];
    await renderer.fireEvent(mesh, "pointerEnter");
    await delay(1000);
    expect(intersection).toHaveBeenCalled();
    expect(intersectionPoint).toHaveBeenCalled();
    expect(intersectionPoint).toHaveBeenCalled();
    expect(mockProp.hoverHandler).not.toHaveBeenCalled();
  });
  it("quando il mouse si sposta e non interseca una delle barre il tooltop non deve apparire", async () => {
    const mockProp: BarsProps = {
      clickHandler: vi.fn(),
      hoverHandler: vi.fn(),
      data: CreateMockRootState().data.data,
    };
    const renderer = await ReactThreeTestRenderer.create(
      <Provider
        store={mockStore(
          CreateMockRootState({
            raycast: {
              barTooltipPosition: null,
              previousSelectedBarId: null,
            },
          }),
        )}>
        <Bars {...mockProp} />,
      </Provider>,
    );

    const mesh = renderer.scene.children[0];
    await renderer.fireEvent(mesh, "pointerLeave");
    await delay(1000);
    expect(mockProp.hoverHandler).toHaveBeenCalledWith(0);
  });
});
