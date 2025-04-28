import { describe, it, expect, beforeEach } from "vitest";
import { thunk } from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { Dataset } from "../../../src/features/data/types/dataset";
import { RootState, AppDispatch } from "../../../src/app/store";
import { DataState } from "../../../src/features/data/types/dataState";
import reducer, {
  requestData,
  filterFirstN,
  filterByValue,
  filterByAverage,
  reset,
  selectorData,
} from "../../../src/features/data/dataSlice";
import fetchMock from "fetch-mock";
import { createMockRootState } from "../../utils/stateMockCreator";

const middlewares = [thunk];
const mockStore = configureMockStore<RootState, AppDispatch>(middlewares);

describe("DataSlice", () => {
  beforeEach(() => {
    fetchMock.unmockGlobal();
    fetchMock.removeRoutes();
  });

  it("Verifica che, quando nessun dataset è selezionato, lo slice rilevante abbia il suo stato dei dati impostato al valore iniziale o a un valore che indica l'assenza di dati", () => {
    const initialState: DataState = {
      data: [],
      legend: null,
      average: 0,
      z: [],
      x: [],
    };
    const store = mockStore(initialState);
    expect(store.getState()).toEqual(initialState);
  });

  it("Verifica che, dopo la selezione e il caricamento con successo del dataset, lo slice rilevante aggiorni il suo stato con i dati del dataset", () => {
    const mockDataset: Dataset = {
      data: [{ id: 0, x: 0, y: 1, z: 0 }],
      legend: { x: "X", y: "Y", z: "Z" },
      xLabels: ["Label 1"],
      zLabels: ["Label 1"],
    };
    const initialState: DataState = {
      data: [],
      legend: null,
      average: 0,
      z: [],
      x: [],
    };
    fetchMock
      .mockGlobal()
      .route("http://localhost:3000/data-visualization/1", mockDataset);

    const expectedState: DataState = {
      data: [{ id: 0, show: true, x: 0, y: 1, z: 0 }],
      legend: { x: "X", y: "Y", z: "Z" },
      average: 1,
      z: ["Label 1"],
      x: ["Label 1"],
    };

    const store = mockStore(initialState);
    return store.dispatch(requestData(1)).then(() => {
      const actions = store.getActions();
      expect(actions[0].type).toEqual("data/requestData/pending");
      expect(actions[1].type).toEqual("data/requestData/fulfilled");
      expect(actions[1].payload).toEqual(mockDataset);
      expect(
        reducer(initialState, {
          type: requestData.fulfilled.type,
          payload: mockDataset,
        }),
      ).toEqual(expectedState);
    });
  });

  it("Verifica che, dopo il tentativo di caricamento fallito del dataset selezionato, lo slice non cambi il suo stato iniziale", () => {
    const errorStatus: number = 400;
    const initialState: DataState = {
      data: [],
      legend: null,
      average: 0,
      z: [],
      x: [],
    };
    fetchMock
      .mockGlobal()
      .route("http://localhost:3000/data-visualization/1", errorStatus);

    const store = mockStore(initialState);
    return store.dispatch(requestData(1)).then(() => {
      const actions = store.getActions();
      expect(actions[0].type).toEqual("data/requestData/pending");
      expect(actions[1].type).toEqual("data/requestData/rejected");
      expect(actions[1].payload).toEqual(errorStatus);
      expect(
        reducer(initialState, { type: requestData.rejected.type }),
      ).toEqual(initialState);
    });
  });

  it("Verifica che, se il dataset non esiste, lo slice non cambi il suo stato iniziale", () => {
    const errorStatus: number = 404;
    const initialState: DataState = {
      data: [],
      legend: null,
      average: 0,
      z: [],
      x: [],
    };
    fetchMock
      .mockGlobal()
      .route("http://localhost:3000/data-visualization/-1", errorStatus);

    const store = mockStore(initialState);
    return store.dispatch(requestData(-1)).then(() => {
      const actions = store.getActions();
      expect(actions[0].type).toEqual("data/requestData/pending");
      expect(actions[1].type).toEqual("data/requestData/rejected");
      expect(actions[1].payload).toEqual(errorStatus);
      expect(
        reducer(initialState, { type: requestData.rejected.type }),
      ).toEqual(initialState);
    });
  });

  it("Verifica che, dopo l'applicazione del filtro 'top 2 valori', lo slice rilevante aggiorni la sua proprietà contenente i dati filtrati in modo da includere solo i 2 elementi con i valori più alti.", () => {
    const initialState: DataState = {
      data: [
        { id: 0, show: true, x: 0, y: 1, z: 0 },
        { id: 1, show: true, x: 0, y: 2, z: 0 },
        { id: 2, show: true, x: 0, y: 3, z: 0 },
        { id: 3, show: true, x: 0, y: 4, z: 0 },
      ],
      legend: { x: "X", y: "Y", z: "Z" },
      average: 2.5,
      z: ["Label 1"],
      x: ["Label 1"],
    };
    const expectedState: DataState = {
      data: [
        { id: 0, show: false, x: 0, y: 1, z: 0 },
        { id: 1, show: false, x: 0, y: 2, z: 0 },
        { id: 2, show: true, x: 0, y: 3, z: 0 },
        { id: 3, show: true, x: 0, y: 4, z: 0 },
      ],
      legend: { x: "X", y: "Y", z: "Z" },
      average: 2.5,
      z: ["Label 1"],
      x: ["Label 1"],
    };
    expect(
      reducer(initialState, filterFirstN({ value: 2, isGreater: true })),
    ).toEqual(expectedState);
  });

  it("Verifica che, dopo l'applicazione del filtro 'bottom 2 valori', lo slice rilevante aggiorni la sua proprietà contenente i dati filtrati in modo da includere solo i 2 elementi con i valori più alti.", () => {
    const initialState: DataState = {
      data: [
        { id: 0, show: true, x: 0, y: 1, z: 0 },
        { id: 1, show: true, x: 0, y: 2, z: 0 },
        { id: 2, show: true, x: 0, y: 3, z: 0 },
        { id: 3, show: true, x: 0, y: 4, z: 0 },
      ],
      legend: { x: "X", y: "Y", z: "Z" },
      average: 2.5,
      z: ["Label 1"],
      x: ["Label 1"],
    };
    const expectedState: DataState = {
      data: [
        { id: 0, show: true, x: 0, y: 1, z: 0 },
        { id: 1, show: true, x: 0, y: 2, z: 0 },
        { id: 2, show: false, x: 0, y: 3, z: 0 },
        { id: 3, show: false, x: 0, y: 4, z: 0 },
      ],
      legend: { x: "X", y: "Y", z: "Z" },
      average: 2.5,
      z: ["Label 1"],
      x: ["Label 1"],
    };
    expect(
      reducer(initialState, filterFirstN({ value: 2, isGreater: false })),
    ).toEqual(expectedState);
  });

  it("Verifica che, dopo aver applicato il filtro 'top 2 valori' e successivamente il filtro 'bottom 2 valori', lo slice rilevante aggiorni la sua proprietà dei dati filtrati in modo da includere solo i 2 elementi con i valori più bassi del dataset originale", () => {
    const initialState: DataState = {
      data: [
        { id: 0, show: true, x: 0, y: 1, z: 0 },
        { id: 1, show: true, x: 0, y: 2, z: 0 },
        { id: 2, show: true, x: 0, y: 3, z: 0 },
        { id: 3, show: true, x: 0, y: 4, z: 0 },
      ],
      legend: { x: "X", y: "Y", z: "Z" },
      average: 2.5,
      z: ["Label 1"],
      x: ["Label 1"],
    };
    const intermediateState: DataState = {
      data: [
        { id: 0, show: true, x: 0, y: 1, z: 0 },
        { id: 1, show: true, x: 0, y: 2, z: 0 },
        { id: 2, show: false, x: 0, y: 3, z: 0 },
        { id: 3, show: false, x: 0, y: 4, z: 0 },
      ],
      legend: { x: "X", y: "Y", z: "Z" },
      average: 2.5,
      z: ["Label 1"],
      x: ["Label 1"],
    };
    expect(
      reducer(initialState, filterFirstN({ value: 2, isGreater: false })),
    ).toEqual(intermediateState);
    const expectedState: DataState = {
      data: [
        { id: 0, show: false, x: 0, y: 1, z: 0 },
        { id: 1, show: false, x: 0, y: 2, z: 0 },
        { id: 2, show: true, x: 0, y: 3, z: 0 },
        { id: 3, show: true, x: 0, y: 4, z: 0 },
      ],
      legend: { x: "X", y: "Y", z: "Z" },
      average: 2.5,
      z: ["Label 1"],
      x: ["Label 1"],
    };
    expect(
      reducer(intermediateState, filterFirstN({ value: 2, isGreater: true })),
    ).toEqual(expectedState);
  });

  it("Verifica che, dopo l'applicazione del filtro 'valori superiori o uguali a 3', lo slice rilevante aggiorni la sua proprietà contenente i dati filtrati in modo da includere solo gli elementi con un valore maggiore o uguale a 3.", () => {
    const initialState: DataState = {
      data: [
        { id: 0, show: true, x: 0, y: 1, z: 0 },
        { id: 1, show: true, x: 0, y: 2, z: 0 },
        { id: 2, show: true, x: 0, y: 3, z: 0 },
        { id: 3, show: true, x: 0, y: 4, z: 0 },
      ],
      legend: { x: "X", y: "Y", z: "Z" },
      average: 2.5,
      z: ["Label 1"],
      x: ["Label 1"],
    };
    const expectedState: DataState = {
      data: [
        { id: 0, show: false, x: 0, y: 1, z: 0 },
        { id: 1, show: false, x: 0, y: 2, z: 0 },
        { id: 2, show: true, x: 0, y: 3, z: 0 },
        { id: 3, show: true, x: 0, y: 4, z: 0 },
      ],
      legend: { x: "X", y: "Y", z: "Z" },
      average: 2.5,
      z: ["Label 1"],
      x: ["Label 1"],
    };
    expect(
      reducer(initialState, filterByValue({ value: 3, isGreater: true })),
    ).toEqual(expectedState);
  });

  it("Verifica che, dopo l'applicazione del filtro 'valori inferiori o uguali a 3', lo slice rilevante aggiorni la sua proprietà contenente i dati filtrati in modo da includere solo gli elementi con un valore minore o uguale a 3.", () => {
    const initialState: DataState = {
      data: [
        { id: 0, show: true, x: 0, y: 1, z: 0 },
        { id: 1, show: true, x: 0, y: 2, z: 0 },
        { id: 2, show: true, x: 0, y: 3, z: 0 },
        { id: 3, show: true, x: 0, y: 4, z: 0 },
      ],
      legend: { x: "X", y: "Y", z: "Z" },
      average: 2.5,
      z: ["Label 1"],
      x: ["Label 1"],
    };
    const expectedState: DataState = {
      data: [
        { id: 0, show: true, x: 0, y: 1, z: 0 },
        { id: 1, show: true, x: 0, y: 2, z: 0 },
        { id: 2, show: true, x: 0, y: 3, z: 0 },
        { id: 3, show: false, x: 0, y: 4, z: 0 },
      ],
      legend: { x: "X", y: "Y", z: "Z" },
      average: 2.5,
      z: ["Label 1"],
      x: ["Label 1"],
    };
    expect(
      reducer(initialState, filterByValue({ value: 3, isGreater: false })),
    ).toEqual(expectedState);
  });

  it("Verifica che, dopo aver applicato il filtro 'valori superiori o uguali a 3' e successivamente il filtro 'valori superiori o uguali a 2', lo slice rilevante aggiorni la sua proprietà dei dati filtrati in modo da includere solo gli elementi con un valore maggiore o uguale a 2", () => {
    const initialState: DataState = {
      data: [
        { id: 0, show: true, x: 0, y: 1, z: 0 },
        { id: 1, show: true, x: 0, y: 2, z: 0 },
        { id: 2, show: true, x: 0, y: 3, z: 0 },
        { id: 3, show: true, x: 0, y: 4, z: 0 },
      ],
      legend: { x: "X", y: "Y", z: "Z" },
      average: 2.5,
      z: ["Label 1"],
      x: ["Label 1"],
    };
    const intermediateState: DataState = {
      data: [
        { id: 0, show: false, x: 0, y: 1, z: 0 },
        { id: 1, show: false, x: 0, y: 2, z: 0 },
        { id: 2, show: true, x: 0, y: 3, z: 0 },
        { id: 3, show: true, x: 0, y: 4, z: 0 },
      ],
      legend: { x: "X", y: "Y", z: "Z" },
      average: 2.5,
      z: ["Label 1"],
      x: ["Label 1"],
    };
    expect(
      reducer(initialState, filterByValue({ value: 3, isGreater: true })),
    ).toEqual(intermediateState);
    const expectedState: DataState = {
      data: [
        { id: 0, show: false, x: 0, y: 1, z: 0 },
        { id: 1, show: true, x: 0, y: 2, z: 0 },
        { id: 2, show: true, x: 0, y: 3, z: 0 },
        { id: 3, show: true, x: 0, y: 4, z: 0 },
      ],
      legend: { x: "X", y: "Y", z: "Z" },
      average: 2.5,
      z: ["Label 1"],
      x: ["Label 1"],
    };
    expect(
      reducer(intermediateState, filterByValue({ value: 2, isGreater: true })),
    ).toEqual(expectedState);
  });

  it("Verifica che, dopo aver applicato il filtro 'valori superiori o uguali a 3' e successivamente il filtro 'valori inferiori o uguali a 2', lo slice rilevante aggiorni la sua proprietà dei dati filtrati in modo da includere solo gli elementi con un valore minore o uguale a 2", () => {
    const initialState: DataState = {
      data: [
        { id: 0, show: true, x: 0, y: 1, z: 0 },
        { id: 1, show: true, x: 0, y: 2, z: 0 },
        { id: 2, show: true, x: 0, y: 3, z: 0 },
        { id: 3, show: true, x: 0, y: 4, z: 0 },
      ],
      legend: { x: "X", y: "Y", z: "Z" },
      average: 2.5,
      z: ["Label 1"],
      x: ["Label 1"],
    };
    const intermediateState: DataState = {
      data: [
        { id: 0, show: false, x: 0, y: 1, z: 0 },
        { id: 1, show: false, x: 0, y: 2, z: 0 },
        { id: 2, show: true, x: 0, y: 3, z: 0 },
        { id: 3, show: true, x: 0, y: 4, z: 0 },
      ],
      legend: { x: "X", y: "Y", z: "Z" },
      average: 2.5,
      z: ["Label 1"],
      x: ["Label 1"],
    };
    expect(
      reducer(initialState, filterByValue({ value: 3, isGreater: true })),
    ).toEqual(intermediateState);
    const expectedState: DataState = {
      data: [
        { id: 0, show: true, x: 0, y: 1, z: 0 },
        { id: 1, show: true, x: 0, y: 2, z: 0 },
        { id: 2, show: false, x: 0, y: 3, z: 0 },
        { id: 3, show: false, x: 0, y: 4, z: 0 },
      ],
      legend: { x: "X", y: "Y", z: "Z" },
      average: 2.5,
      z: ["Label 1"],
      x: ["Label 1"],
    };
    expect(
      reducer(intermediateState, filterByValue({ value: 2, isGreater: false })),
    ).toEqual(expectedState);
  });

  it("Verifica che, dopo l'applicazione del filtro 'valori superiori al valor medio', lo slice rilevante aggiorni la sua proprietà contenente i dati filtrati in modo da includere solo gli elementi con un valore maggiore della media calcolata per il dataset.", () => {
    const initialState: DataState = {
      data: [
        { id: 0, show: true, x: 0, y: 1, z: 0 },
        { id: 1, show: true, x: 0, y: 2, z: 0 },
        { id: 2, show: true, x: 0, y: 3, z: 0 },
        { id: 3, show: true, x: 0, y: 4, z: 0 },
      ],
      legend: { x: "X", y: "Y", z: "Z" },
      average: 2.5,
      z: ["Label 1"],
      x: ["Label 1"],
    };
    const expectedState: DataState = {
      data: [
        { id: 0, show: false, x: 0, y: 1, z: 0 },
        { id: 1, show: false, x: 0, y: 2, z: 0 },
        { id: 2, show: true, x: 0, y: 3, z: 0 },
        { id: 3, show: true, x: 0, y: 4, z: 0 },
      ],
      legend: { x: "X", y: "Y", z: "Z" },
      average: 2.5,
      z: ["Label 1"],
      x: ["Label 1"],
    };
    expect(reducer(initialState, filterByAverage(true))).toEqual(expectedState);
  });

  it("Verifica che, dopo l'applicazione del filtro 'valori inferiori al valor medio', lo slice rilevante aggiorni la sua proprietà contenente i dati filtrati in modo da includere solo gli elementi con un valore minore della media calcolata per il dataset.", () => {
    const initialState: DataState = {
      data: [
        { id: 0, show: true, x: 0, y: 1, z: 0 },
        { id: 1, show: true, x: 0, y: 2, z: 0 },
        { id: 2, show: true, x: 0, y: 3, z: 0 },
        { id: 3, show: true, x: 0, y: 4, z: 0 },
      ],
      legend: { x: "X", y: "Y", z: "Z" },
      average: 2.5,
      z: ["Label 1"],
      x: ["Label 1"],
    };
    const expectedState: DataState = {
      data: [
        { id: 0, show: true, x: 0, y: 1, z: 0 },
        { id: 1, show: true, x: 0, y: 2, z: 0 },
        { id: 2, show: false, x: 0, y: 3, z: 0 },
        { id: 3, show: false, x: 0, y: 4, z: 0 },
      ],
      legend: { x: "X", y: "Y", z: "Z" },
      average: 2.5,
      z: ["Label 1"],
      x: ["Label 1"],
    };
    expect(reducer(initialState, filterByAverage(false))).toEqual(
      expectedState,
    );
  });

  it("Verifica che, dopo aver applicato il filtro 'valori superiori al valor medio' e successivamente il filtro 'valori inferiori al valor medio', lo slice rilevante aggiorni la sua proprietà dei dati filtrati in modo da includere solo gli elementi con un valore minore della media calcolata per il dataset", () => {
    const initialState: DataState = {
      data: [
        { id: 0, show: true, x: 0, y: 1, z: 0 },
        { id: 1, show: true, x: 0, y: 2, z: 0 },
        { id: 2, show: true, x: 0, y: 3, z: 0 },
        { id: 3, show: true, x: 0, y: 4, z: 0 },
      ],
      legend: { x: "X", y: "Y", z: "Z" },
      average: 2.5,
      z: ["Label 1"],
      x: ["Label 1"],
    };
    const intermediateState: DataState = {
      data: [
        { id: 0, show: false, x: 0, y: 1, z: 0 },
        { id: 1, show: false, x: 0, y: 2, z: 0 },
        { id: 2, show: true, x: 0, y: 3, z: 0 },
        { id: 3, show: true, x: 0, y: 4, z: 0 },
      ],
      legend: { x: "X", y: "Y", z: "Z" },
      average: 2.5,
      z: ["Label 1"],
      x: ["Label 1"],
    };
    expect(reducer(initialState, filterByAverage(true))).toEqual(
      intermediateState,
    );
    const expectedState: DataState = {
      data: [
        { id: 0, show: true, x: 0, y: 1, z: 0 },
        { id: 1, show: true, x: 0, y: 2, z: 0 },
        { id: 2, show: false, x: 0, y: 3, z: 0 },
        { id: 3, show: false, x: 0, y: 4, z: 0 },
      ],
      legend: { x: "X", y: "Y", z: "Z" },
      average: 2.5,
      z: ["Label 1"],
      x: ["Label 1"],
    };
    expect(reducer(intermediateState, filterByAverage(false))).toEqual(
      expectedState,
    );
  });

  it("Verifica che lo slice rilevante riporti la sua proprietà contenente i dati filtrati allo stesso stato dei dati originali del dataset.", () => {
    const initialState: DataState = {
      data: [
        { id: 0, show: true, x: 0, y: 1, z: 0 },
        { id: 1, show: true, x: 0, y: 2, z: 0 },
        { id: 2, show: true, x: 0, y: 3, z: 0 },
        { id: 3, show: true, x: 0, y: 4, z: 0 },
      ],
      legend: { x: "X", y: "Y", z: "Z" },
      average: 2.5,
      z: ["Label 1"],
      x: ["Label 1"],
    };
    const expectedState: DataState = {
      data: [
        { id: 0, show: true, x: 0, y: 1, z: 0 },
        { id: 1, show: true, x: 0, y: 2, z: 0 },
        { id: 2, show: false, x: 0, y: 3, z: 0 },
        { id: 3, show: false, x: 0, y: 4, z: 0 },
      ],
      legend: { x: "X", y: "Y", z: "Z" },
      average: 2.5,
      z: ["Label 1"],
      x: ["Label 1"],
    };
    expect(reducer(initialState, filterByAverage(false))).toEqual(
      expectedState,
    );
    expect(reducer(initialState, reset())).toEqual(initialState);
  });

  it("Verifica che sia possibile accedere ai dati del dataset gestiti dallo slice rilevante tramite il selettore appropriato.", () => {
    const overrides = {
      data: {
        data: [
          { id: 0, show: true, x: 0, y: 1, z: 0 },
          { id: 1, show: true, x: 0, y: 2, z: 0 },
          { id: 2, show: true, x: 0, y: 3, z: 0 },
          { id: 3, show: true, x: 0, y: 4, z: 0 },
        ],
        legend: { x: "X", y: "Y", z: "Z" },
        average: 2.5,
        z: ["Label 1"],
        x: ["Label 1"],
      } as DataState,
    };
    const mockState = createMockRootState(overrides);
    expect(selectorData(mockState)).toEqual(overrides.data);
  });
});
