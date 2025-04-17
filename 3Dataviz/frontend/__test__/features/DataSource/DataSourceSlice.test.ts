import { beforeEach, describe, expect, it } from "vitest";
import { thunk } from "redux-thunk";
import configureMockStore from "redux-mock-store";
import fetchMock from "fetch-mock";
import { AppDispatch, RootState } from "../../../src/app/Store";
import { DataSourceState } from "../../../src/features/DataSource/types/DataSourceState";
import { DatasetInfo } from "../../../src/features/DataSource/types/DatasetInfo";
import reducer, {
  requestDatasets,
  selectorCurrentDataset,
  selectorDatasets,
  trySetCurrentDataset,
} from "../../../src/features/DataSource/DataSourceSlice";
import { CreateMockRootState } from "../../utils/StateMockCreator";

const middlewares = [thunk];
const mockStore = configureMockStore<RootState, AppDispatch>(middlewares);

describe("DataSourceSlice", () => {
  beforeEach(() => {
    fetchMock.unmockGlobal();
    fetchMock.removeRoutes();
  });
  it("Dataset non selezionato", () => {
    const initialState: DataSourceState = {
      datasets: [],
      currentDataset: null,
    };
    const store = mockStore(initialState);
    expect(store.getState()).toEqual(initialState);
  });

  it("Reperimento datasets", () => {
    const mockDatasets: DatasetInfo[] = [
      { id: 0, name: "D1", size: [1, 1], description: "desc" },
      { id: 1, name: "D2", size: [1, 1], description: "desc" },
      { id: 2, name: "D3", size: [1, 1], description: "desc" },
      { id: 3, name: "D4", size: [1, 1], description: "desc" },
    ];
    const initialState: DataSourceState = {
      datasets: [],
      currentDataset: null,
    };
    fetchMock
      .mockGlobal()
      .route("http://127.0.0.1:5000/data-source", mockDatasets);

    const expectedState: DataSourceState = {
      datasets: mockDatasets,
      currentDataset: null,
    };
    const store = mockStore(initialState);
    return store.dispatch(requestDatasets()).then(() => {
      const actions = store.getActions();
      expect(actions[0].type).toEqual("dataSource/requestDatasets/pending");
      expect(actions[1].type).toEqual("dataSource/requestDatasets/fulfilled");
      expect(actions[1].payload).toEqual(mockDatasets);
      expect(
        reducer(initialState, {
          type: requestDatasets.fulfilled.type,
          payload: mockDatasets,
        }),
      ).toEqual(expectedState);
    });
  });

  it("Reperimento dataset non andato a buon fine", () => {
    const errorStatus: number = 400;
    const initialState: DataSourceState = {
      datasets: [],
      currentDataset: null,
    };
    fetchMock
      .mockGlobal()
      .route("http://127.0.0.1:5000/data-source", errorStatus);
    const store = mockStore(initialState);
    return store.dispatch(requestDatasets()).then(() => {
      const actions = store.getActions();
      expect(actions[0].type).toEqual("dataSource/requestDatasets/pending");
      expect(actions[1].type).toEqual("dataSource/requestDatasets/rejected");
      expect(actions[1].payload).toEqual(errorStatus);
      expect(
        reducer(initialState, {
          type: requestDatasets.rejected.type,
        }),
      ).toEqual(initialState);
    });
  });

  it("Selezione di un dataset", () => {
    const mockDatasets: DatasetInfo[] = [
      { id: 0, name: "D1", size: [1, 1], description: "desc" },
      { id: 1, name: "D2", size: [1, 1], description: "desc" },
      { id: 2, name: "D3", size: [1, 1], description: "desc" },
      { id: 3, name: "D4", size: [1, 1], description: "desc" },
    ];
    const initialState: DataSourceState = {
      datasets: mockDatasets,
      currentDataset: null,
    };
    const expectedState: DataSourceState = {
      datasets: mockDatasets,
      currentDataset: { id: 0, name: "D1", size: [1, 1], description: "desc" },
    };
    expect(reducer(initialState, trySetCurrentDataset(0))).toEqual(
      expectedState,
    );
  });

  it("Selezione di un dataset non esistente", () => {
    const mockDatasets: DatasetInfo[] = [
      { id: 0, name: "D1", size: [1, 1], description: "desc" },
      { id: 1, name: "D2", size: [1, 1], description: "desc" },
      { id: 2, name: "D3", size: [1, 1], description: "desc" },
      { id: 3, name: "D4", size: [1, 1], description: "desc" },
    ];
    const initialState: DataSourceState = {
      datasets: mockDatasets,
      currentDataset: null,
    };
    const expectedState: DataSourceState = {
      datasets: mockDatasets,
      currentDataset: null,
    };
    expect(reducer(initialState, trySetCurrentDataset(5))).toEqual(
      expectedState,
    );
    // TODO: TESTARE SE APPSTATUS HA L`ERRORE
  });

  it("Prendere la lista di dataset", () => {
    const mockDatasets: DatasetInfo[] = [
      { id: 0, name: "D1", size: [1, 1], description: "desc" },
      { id: 1, name: "D2", size: [1, 1], description: "desc" },
      { id: 2, name: "D3", size: [1, 1], description: "desc" },
      { id: 3, name: "D4", size: [1, 1], description: "desc" },
    ];

    const overrides = {
      dataSource: {
        datasets: mockDatasets,
        currentDataset: null,
      } as DataSourceState,
    };

    const mockState = CreateMockRootState(overrides);
    expect(selectorDatasets(mockState)).toEqual(overrides.dataSource.datasets);
  });

  it("Prendere il dataset selezionato", () => {
    const mockDatasets: DatasetInfo[] = [
      { id: 0, name: "D1", size: [1, 1], description: "desc" },
      { id: 1, name: "D2", size: [1, 1], description: "desc" },
      { id: 2, name: "D3", size: [1, 1], description: "desc" },
      { id: 3, name: "D4", size: [1, 1], description: "desc" },
    ];

    const overrides = {
      dataSource: {
        datasets: mockDatasets,
        currentDataset: null,
      } as DataSourceState,
    };

    const mockState = CreateMockRootState(overrides);
    expect(selectorCurrentDataset(mockState)).toEqual(
      overrides.dataSource.currentDataset,
    );
  });
});
