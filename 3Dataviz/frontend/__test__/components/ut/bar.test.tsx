import { beforeEach, describe, expect, it, vi } from "vitest";
import { BarsProps } from "../../../src/components/barChart/bars/props/barsProps";
import Bars from "../../../src/components/barChart/bars/bars";
import ReactThreeTestRenderer from "@react-three/test-renderer";
import React from "react";
import { createMockRootState } from "../../utils/stateMockCreator";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import { RootState } from "@react-three/fiber";
import { AppDispatch } from "../../../src/app/store";
import * as raycaster from "../../../src/components/barChart/bars/utils/raycastUtils";
import * as colors from "../../../src/components/barChart/bars/utils/colorsUtils";
import { delay } from "../../setupTests";

const middlewares = [thunk];
const mockStore = configureMockStore<RootState, AppDispatch>(middlewares);

describe("Bars", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("Verifica che la renderizzazione delle barre avvenga senza generare errori o causare un crash dell'applicazione.", async () => {
    const mockProp: BarsProps = {
      clickHandler: vi.fn(),
      hoverHandler: vi.fn(),
      data: createMockRootState().data.data,
    };
    const renderer = await ReactThreeTestRenderer.create(
      <Provider
        store={mockStore(
          createMockRootState({
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
  it("Verifica che, al click su una barra, venga calcolata correttamente l'intersezione con la posizione del puntatore, che il colore della barra cambi visivamente e che venga invocata la funzione click handler associata.", async () => {
    const mockProp: BarsProps = {
      clickHandler: vi.fn(),
      hoverHandler: vi.fn(),
      data: createMockRootState().data.data,
    };
    const selection = vi.spyOn(colors, "Selection");
    const renderer = await ReactThreeTestRenderer.create(
      <Provider
        store={mockStore(
          createMockRootState({
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
  it("Verifica che quando il puntatore del mouse si sposta al di fuori di una qualsiasi barra, il tooltip non sia visibile.", async () => {
    const mockProp: BarsProps = {
      clickHandler: vi.fn(),
      hoverHandler: vi.fn(),
      data: createMockRootState().data.data,
    };
    const renderer = await ReactThreeTestRenderer.create(
      <Provider
        store={mockStore(
          createMockRootState({
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

  it("Verifica che quando il puntatore del mouse esce dall'area di una barra, il tooltip scompaia.", async () => {
    const mockProp: BarsProps = {
      clickHandler: vi.fn(),
      hoverHandler: vi.fn(),
      data: createMockRootState().data.data,
    };
    const renderer = await ReactThreeTestRenderer.create(
      <Provider
        store={mockStore(
          createMockRootState({
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
    expect(mockProp.hoverHandler).toHaveBeenCalledWith(0, null);
  });
});
