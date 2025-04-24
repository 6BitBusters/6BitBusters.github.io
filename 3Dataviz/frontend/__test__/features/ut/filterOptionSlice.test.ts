import { describe, it, expect } from "vitest";
import reducer, {
  selectorIsGreater,
  toggleIsGreater,
} from "../../../src/features/filterOption/filterOptionSlice";
import { FilterOptionState } from "../../../src/features/filterOption/types/filterOption";
import { createMockRootState } from "../../utils/stateMockCreator";

describe("filterOptionSlice", () => {
  it("should return the initial state when passed an empty action", () => {
    const initialState: FilterOptionState = {
      isGreater: false,
    };
    const result = reducer(undefined, { type: "" });
    expect(result).toEqual(initialState);
  });

  it("should toggle isGreater from false to true", () => {
    const initialState: FilterOptionState = {
      isGreater: false,
    };
    const result = reducer(initialState, toggleIsGreater(true));
    expect(result.isGreater).toBe(true);
  });

  it("should toggle isGreater back to false if called twice", () => {
    const initialState: FilterOptionState = {
      isGreater: true,
    };
    const result = reducer(initialState, toggleIsGreater(false));
    expect(result.isGreater).toBe(false);
  });
  it("Get state", () => {
    const overrides = {
      filterOption: {
        isGreater: false,
      } as FilterOptionState,
    };
    const mockState = createMockRootState(overrides);
    expect(selectorIsGreater(mockState)).toBe(false);
  });
});
