import { describe, it, expect } from "vitest";
import reducer, {
  selectorIsGreater,
  toggleIsGreater,
} from "../../../src/features/filterOption/filterOptionSlice";
import { FilterOptionState } from "../../../src/features/filterOption/types/filterOption";
import { createMockRootState } from "../../utils/stateMockCreator";

describe("filterOptionSlice", () => {
  it("Verifica che, quando il reducer dello slice viene chiamato con un'azione vuota ritorni un oggetto strettamente uguale allo stato iniziale.", () => {
    const initialState: FilterOptionState = {
      isGreater: false,
    };
    const result = reducer(undefined, { type: "" });
    expect(result).toEqual(initialState);
  });

  it("Verifica che, dopo l'invio dell'azione designata, la proprietà isGreater nello stato dello slice rilevante sia passata dal valore false al valore true", () => {
    const initialState: FilterOptionState = {
      isGreater: false,
    };
    const result = reducer(initialState, toggleIsGreater(true));
    expect(result.isGreater).toBe(true);
  });

  it("Verifica che, dopo l'invio dell'azione designata, la proprietà isGreater nello stato dello slice rilevante sia passata dal valore true al valore false", () => {
    const initialState: FilterOptionState = {
      isGreater: true,
    };
    const result = reducer(initialState, toggleIsGreater(false));
    expect(result.isGreater).toBe(false);
  });
  it("Verifica che sia possibile accedere allo stato delle opzioni di filtraggio tramite il selettore appropriato.", () => {
    const overrides = {
      filterOption: {
        isGreater: false,
      } as FilterOptionState,
    };
    const mockState = createMockRootState(overrides);
    expect(selectorIsGreater(mockState)).toBe(false);
  });
});
