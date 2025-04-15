import { describe, it, expect, beforeEach } from "vitest";
import { thunk } from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { Dataset } from "../../../src/features/Data/types/Dataset";
import { RootState, AppDispatch } from "../../../src/app/Store";
import { DataState } from "../../../src/features/Data/types/DataState";
import reducer, {
  requestData,
  filterTopN,
  filterAboveValue,
  filterAverage,
  reset,
  selectorData,
} from "../../../src/features/Data/DataSlice";
import fetchMock from "fetch-mock";

const middlewares = [thunk];
const mockStore = configureMockStore<RootState, AppDispatch>(middlewares);

describe("DataSlice", () => {
  beforeEach(() => {
    fetchMock.unmockGlobal();
    fetchMock.removeRoutes();
  });

  it("Dataset non selezionato", () => {
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

  it("Dataset selezionato e caricato con successo", () => {
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
      .route("http://127.0.0.1:5000/data-visualization/1", mockDataset);

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

  it("Dataset selezionato e caricato con insuccesso", () => {
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
      .route("http://127.0.0.1:5000/data-visualization/1", errorStatus);

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

  it("Dataset selezionato non esiste", () => {
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
      .route("http://127.0.0.1:5000/data-visualization/-1", errorStatus);

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

  it("Filtraggio dei top 2 valori", () => {
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
      reducer(initialState, filterTopN({ value: 2, isGreater: true })),
    ).toEqual(expectedState);
  });

  it("Filtraggio dei bottom 2 valori", () => {
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
      reducer(initialState, filterTopN({ value: 2, isGreater: false })),
    ).toEqual(expectedState);
  });

  it("Filtraggio dei valori superiori o uguali a 3", () => {
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
      reducer(initialState, filterAboveValue({ value: 3, isGreater: true })),
    ).toEqual(expectedState);
  });

  it("Filtraggio dei valori inferiori o uguali a 3", () => {
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
      reducer(initialState, filterAboveValue({ value: 3, isGreater: false })),
    ).toEqual(expectedState);
  });

  it("Filtraggio dei valori superiori al valor medio", () => {
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
    expect(reducer(initialState, filterAverage(true))).toEqual(expectedState);
  });

  it("Filtraggio dei valori inferiori al valor medio", () => {
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
    expect(reducer(initialState, filterAverage(false))).toEqual(expectedState);
  });

  it("Reset filtri", () => {
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
    expect(reducer(initialState, filterAverage(false))).toEqual(expectedState);
    expect(reducer(initialState, reset())).toEqual(initialState);
  });

  it("Prendere i dati del dataset", () => {
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
    expect(selectorData(initialState)).toEqual(initialState);
  });
});
