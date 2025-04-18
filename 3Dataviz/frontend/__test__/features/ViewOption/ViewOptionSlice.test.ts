import { describe, expect, it } from "vitest";
import reducer, {
  selectorViewOptionState,
  toggleAveragePlane,
} from "../../../src/features/ViewOption/ViewOptionSlice";
import { ViewOptionState } from "../../../src/features/ViewOption/types/ViewOptionState";
import { CreateMockRootState } from "../../utils/StateMockCreator";

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
    const overrides = {
      viewOption: {
        isPlaneActive: true,
      } as ViewOptionState,
    };
    const mockState = CreateMockRootState(overrides);
    expect(selectorViewOptionState(mockState)).toBe(true);
  });
});
