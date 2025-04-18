import { describe, expect, it } from "vitest";
import { RaycastHit } from "../../../src/features/Raycast/types/RaycastHit";
import reducer, {
  selectorRaycastHit,
  setHit,
  setTooltipPosition,
} from "../../../src/features/Raycast/RaycastHitSlice";
import { Vector3 } from "three";

describe("RaycastHitSlice", () => {
  it("Registra una intersezione (hover) su una barra", () => {
    const initialState: RaycastHit = {
      previousSelectedBarId: null,
      barTooltipPosition: null,
    };
    const mousePosition: Vector3 = new Vector3(2, 1, 3);

    const expectedState: RaycastHit = {
      previousSelectedBarId: null,
      barTooltipPosition: mousePosition,
    };
    expect(reducer(initialState, setTooltipPosition(mousePosition))).toEqual(
      expectedState,
    );
  });
  it("Registra una intersezione (click) su una barra", () => {
    const initialState: RaycastHit = {
      previousSelectedBarId: null,
      barTooltipPosition: null,
    };
    const mousePosition: Vector3 = new Vector3(2, 1, 3);
    const clickedBarId: number = 4;

    const midState = reducer(initialState, setTooltipPosition(mousePosition));

    const expectedState: RaycastHit = {
      previousSelectedBarId: clickedBarId,
      barTooltipPosition: mousePosition,
    };
    expect(reducer(midState, setHit(clickedBarId))).toEqual(expectedState);
  });
  it("Registra una intersezione (hover) su uno spazio vuoto", () => {
    const initialState: RaycastHit = {
      previousSelectedBarId: 4,
      barTooltipPosition: new Vector3(2, 1, 3),
    };
    const expectedState: RaycastHit = {
      previousSelectedBarId: 4,
      barTooltipPosition: null,
    };
    expect(reducer(initialState, setTooltipPosition(null))).toEqual(
      expectedState,
    );
  });
  it("Registra una intersezione (click) su uno spazio vuoto", () => {
    const initialState: RaycastHit = {
      previousSelectedBarId: 4,
      barTooltipPosition: new Vector3(2, 1, 3),
    };
    const expectedState: RaycastHit = {
      previousSelectedBarId: 4,
      barTooltipPosition: null,
    };
    expect(reducer(initialState, setTooltipPosition(null))).toEqual(
      expectedState,
    );
  });
  it("Registra una intersezione (hover) su piu` barre consecutivamente barra", () => {
    const initialState: RaycastHit = {
      previousSelectedBarId: null,
      barTooltipPosition: null,
    };
    let mousePosition: Vector3 = new Vector3(2, 1, 3);
    const midState: RaycastHit = {
      previousSelectedBarId: null,
      barTooltipPosition: mousePosition,
    };
    expect(reducer(initialState, setTooltipPosition(mousePosition))).toEqual(
      midState,
    );

    mousePosition = new Vector3(7, 3, 9);
    const expectedState: RaycastHit = {
      previousSelectedBarId: null,
      barTooltipPosition: mousePosition,
    };
    expect(reducer(midState, setTooltipPosition(mousePosition))).toEqual(
      expectedState,
    );
  });
  it("Registra una intersezione (click) su piu` barre consecutivamente barra", () => {
    const initialState: RaycastHit = {
      previousSelectedBarId: null,
      barTooltipPosition: null,
    };
    let mousePosition: Vector3 = new Vector3(2, 1, 3);
    let clickedBarId: number = 4;
    const midState: RaycastHit = {
      previousSelectedBarId: clickedBarId,
      barTooltipPosition: mousePosition,
    };
    expect(
      reducer(
        reducer(initialState, setTooltipPosition(mousePosition)),
        setHit(clickedBarId),
      ),
    ).toEqual(midState);

    mousePosition = new Vector3(7, 3, 9);
    clickedBarId = 8;
    const expectedState: RaycastHit = {
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
    const state: RaycastHit = {
      previousSelectedBarId: 3,
      barTooltipPosition: new Vector3(7, 3, 9),
    };
    expect(selectorRaycastHit(state)).toEqual(state);
  });
});
