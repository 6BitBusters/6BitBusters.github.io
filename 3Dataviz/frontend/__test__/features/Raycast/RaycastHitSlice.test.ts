import { describe, expect, it } from "vitest";
import { RaycastHitState } from "../../../src/features/Raycast/types/RaycastHitState";
import reducer, {
  selectorRaycastHit,
  setHit,
  setTooltipPosition,
} from "../../../src/features/Raycast/RaycastHitSlice";
import { Vector3 } from "three";
import { createMockRootState } from "../../utils/StatesMockCreator";

describe("RaycastHitSlice", () => {
  it("Registra una intersezione (hover) su una barra", () => {
    const initialState: RaycastHitState = {
      previousSelectedBarId: null,
      barTooltipPosition: null,
    };
    const mousePosition: [number,number,number] = [2,1,3];

    const expectedState: RaycastHitState = {
      previousSelectedBarId: null,
      barTooltipPosition: mousePosition,
    };
    expect(reducer(initialState, setTooltipPosition(mousePosition))).toEqual(
      expectedState,
    );
  });
  it("Registra una intersezione (click) su una barra", () => {
    const initialState: RaycastHitState = {
      previousSelectedBarId: null,
      barTooltipPosition: null,
    };
    const mousePosition: [number,number,number] = [2,1,3];
    const clickedBarId: number = 4;

    const midState = reducer(initialState, setTooltipPosition(mousePosition));

    const expectedState: RaycastHitState = {
      previousSelectedBarId: clickedBarId,
      barTooltipPosition: mousePosition,
    };
    expect(reducer(midState, setHit(clickedBarId))).toEqual(expectedState);
  });
  it("Registra una intersezione (hover) su uno spazio vuoto", () => {
    const initialState: RaycastHitState = {
      previousSelectedBarId: 4,
      barTooltipPosition: [2,1,3],
    };
    const expectedState: RaycastHitState = {
      previousSelectedBarId: 4,
      barTooltipPosition: null,
    };
    expect(reducer(initialState, setTooltipPosition(null))).toEqual(
      expectedState,
    );
  });
  it("Registra una intersezione (click) su uno spazio vuoto", () => {
    const initialState: RaycastHitState = {
      previousSelectedBarId: 4,
      barTooltipPosition: [2,1,3],
    };
    const expectedState: RaycastHitState = {
      previousSelectedBarId: 4,
      barTooltipPosition: null,
    };
    expect(reducer(initialState, setTooltipPosition(null))).toEqual(
      expectedState,
    );
  });
  it("Registra una intersezione (hover) su piu` barre consecutivamente barra", () => {
    const initialState: RaycastHitState = {
      previousSelectedBarId: null,
      barTooltipPosition: null,
    };
    let mousePosition: [number,number,number] = [2,1,3];
    const midState: RaycastHitState = {
      previousSelectedBarId: null,
      barTooltipPosition: mousePosition,
    };
    expect(reducer(initialState, setTooltipPosition(mousePosition))).toEqual(
      midState,
    );

    mousePosition = [7, 3, 9];
    const expectedState: RaycastHitState = {
      previousSelectedBarId: null,
      barTooltipPosition: mousePosition,
    };
    expect(reducer(midState, setTooltipPosition(mousePosition))).toEqual(
      expectedState,
    );
  });
  it("Registra una intersezione (click) su piu` barre consecutivamente barra", () => {
    const initialState: RaycastHitState = {
      previousSelectedBarId: null,
      barTooltipPosition: null,
    };
    let mousePosition: [number,number,number] = [2,1,3];
    let clickedBarId: number = 4;
    const midState: RaycastHitState = {
      previousSelectedBarId: clickedBarId,
      barTooltipPosition: mousePosition,
    };
    expect(
      reducer(
        reducer(initialState, setTooltipPosition(mousePosition)),
        setHit(clickedBarId),
      ),
    ).toEqual(midState);

    mousePosition = [7, 3, 9];
    clickedBarId = 8;
    const expectedState: RaycastHitState = {
      previousSelectedBarId: clickedBarId,
      barTooltipPosition: mousePosition,
    };
    expect(
      reducer(
        reducer(initialState, setTooltipPosition(mousePosition)),
        setHit(clickedBarId),
      ),
    ).toEqual(expectedState);
  });
  it("Prendi lo stato", () => {
    const overrides = {
      raycast : {
        previousSelectedBarId: 3,
        barTooltipPosition: [7, 3, 9],
      } as RaycastHitState
    }
    const mockState = createMockRootState(overrides);
    expect(selectorRaycastHit(mockState)).toEqual(overrides.raycast);
  });
});
