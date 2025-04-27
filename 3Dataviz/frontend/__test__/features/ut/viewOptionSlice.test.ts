import { describe, expect, it } from "vitest";
import reducer, {
  selectorViewOptionState,
  toggleAveragePlane,
} from "../../../src/features/viewOption/viewOptionSlice";
import { ViewOptionState } from "../../../src/features/viewOption/types/viewOptionState";
import { createMockRootState } from "../../utils/stateMockCreator";

describe("ViewOptionSlice", () => {
  it("Verifica che, dopo l'invio dell'azione designata, la proprietà isPlaneActive nello stato dello slice rilevante sia passata dal valore false al valore true", () => {
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
  it("Verifica che, dopo l'invio dell'azione designata, la proprietà isPlaneActive nello stato dello slice rilevante sia passata dal valore true al valore false", () => {
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
  it("Verifica che sia possibile accedere allo stato delle opzioni di vista tramite il selettore appropriato.", () => {
    const state: ViewOptionState = {
      isPlaneActive: true,
    };
    const overrides = {
      viewOption: {
        isPlaneActive: true,
      } as ViewOptionState,
    };
    const mockState = createMockRootState(overrides);
    expect(selectorViewOptionState(mockState)).toBe(true);
  });
});
