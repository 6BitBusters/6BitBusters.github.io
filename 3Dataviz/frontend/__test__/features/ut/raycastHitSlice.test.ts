import { describe, expect, it } from "vitest";
import { RaycastHitState } from "../../../src/features/raycast/types/raycastHitState";
import reducer, {
  selectorRaycastHit,
  setHit,
  setTooltipPosition,
} from "../../../src/features/raycast/raycastHitSlice";
import { createMockRootState } from "../../utils/stateMockCreator";

describe("RaycastHitSlice", () => {
  it("Verifica che l'invio dell'azione setTooltipPosition aggiorni la proprietà barTooltipPosition dello stato con le coordinate fornite.", () => {
    const initialState: RaycastHitState = {
      previousSelectedBarId: null,
      barTooltipPosition: null,
    };
    const mousePosition: [number, number, number] = [2, 1, 3];

    const expectedState: RaycastHitState = {
      previousSelectedBarId: null,
      barTooltipPosition: mousePosition,
    };
    expect(reducer(initialState, setTooltipPosition(mousePosition))).toEqual(
      expectedState,
    );
  });
  it("Verifica che l'invio dell'azione setHit aggiorni la proprietà previousSelectedBarId dello stato con ID della barra selezionata", () => {
    const initialState: RaycastHitState = {
      previousSelectedBarId: null,
      barTooltipPosition: null,
    };
    const mousePosition: [number, number, number] = [2, 1, 3];
    const clickedBarId: number = 4;

    const midState = reducer(initialState, setTooltipPosition(mousePosition));

    const expectedState: RaycastHitState = {
      previousSelectedBarId: clickedBarId,
      barTooltipPosition: mousePosition,
    };
    expect(reducer(midState, setHit(clickedBarId))).toEqual(expectedState);
  });
  it("Verifica che l'invio dell'azione setTooltipPosition aggiorni la proprietà barTooltipPosition dello stato a null se le coordinate fornite non intersecano nessuna barra e ID della barra selezionata rimanga invariato.", () => {
    const initialState: RaycastHitState = {
      previousSelectedBarId: 4,
      barTooltipPosition: [2, 1, 3],
    };
    const expectedState: RaycastHitState = {
      previousSelectedBarId: 4,
      barTooltipPosition: null,
    };
    expect(reducer(initialState, setTooltipPosition(null))).toEqual(
      expectedState,
    );
  });
  it("Verifica che l'invio dell'azione setTooltipPosition aggiorni la proprietà barTooltipPosition dello stato con le coordinate fornite (aggiornamento consecutivo).", () => {
    const initialState: RaycastHitState = {
      previousSelectedBarId: null,
      barTooltipPosition: null,
    };
    let mousePosition: [number, number, number] = [2, 1, 3];
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
  it("Verifica che l'invio dell'azione setHit aggiorni la proprietà previousSelectedBarId dello stato con ID della barra selezionata (aggiornamento consecutivo)", () => {
    const initialState: RaycastHitState = {
      previousSelectedBarId: null,
      barTooltipPosition: null,
    };
    let mousePosition: [number, number, number] = [2, 1, 3];
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
  it("Verifica che sia possibile accedere allo stato del raycast tramite il selettore appropriato.", () => {
    const overrides = {
      raycast: {
        previousSelectedBarId: 3,
        barTooltipPosition: [7, 3, 9],
      } as RaycastHitState,
    };
    const mockState = createMockRootState(overrides);
    expect(selectorRaycastHit(mockState)).toEqual(overrides.raycast);
  });
});
