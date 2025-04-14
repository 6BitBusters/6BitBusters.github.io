import { describe, expect, it } from "vitest";
import reducer, {
  selectorViewOptionState,
  toggleAveragePlane,
} from "../../../src/features/ViewOption/ViewOptionSlice";
import { ViewOptionState } from "../../../src/features/ViewOption/types/ViewOptionState";

describe("ViewOptionSlice", () => {
  it("Rendi il piano visibile", () => {
    const initialState: ViewOptionState = {
      isPlaneActive: false,
    };
    const expectedState: ViewOptionState = {
      isPlaneActive: true,
    };
    expect(reducer(initialState, toggleAveragePlane(true))).toEqual(
      expectedState,
    );
  });
  it("Rendi il piano invisibile", () => {
    const initialState: ViewOptionState = {
      isPlaneActive: true,
    };
    const expectedState: ViewOptionState = {
      isPlaneActive: false,
    };
    expect(reducer(initialState, toggleAveragePlane(false))).toEqual(
      expectedState,
    );
  });
  it("Prendere lo stato", () => {
    const state: ViewOptionState = {
      isPlaneActive: true,
    };
    expect(selectorViewOptionState(state)).toBe(true);
  });
});
