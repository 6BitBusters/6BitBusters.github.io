import { beforeEach, describe, expect, it } from "vitest";
import { thunk } from "redux-thunk";
import configureMockStore from "redux-mock-store";
import fetchMock from "fetch-mock";
import { AppDispatch, RootState } from "../../../src/app/store";
import { DataSourceState } from "../../../src/features/dataSource/types/dataSourceState";
import { DatasetInfo } from "../../../src/features/dataSource/types/datasetInfo";
import reducer, {
  requestDatasets,
  selectorCurrentDataset,
  selectorDatasets,
  trySetCurrentDataset,
} from "../../../src/features/dataSource/dataSourceSlice";
import { createMockRootState } from "../../utils/stateMockCreator";

const middlewares = [thunk];
const mockStore = configureMockStore<RootState, AppDispatch>(middlewares);

describe("DataSourceSlice", () => {
  beforeEach(() => {
    fetchMock.unmockGlobal();
    fetchMock.removeRoutes();
  });
  it("Verifica che, quando nessun dataset è selezionato, lo slice rilevante abbia il suo stato dei dati impostato al valore iniziale o a un valore che indica l'assenza di dati", () => {
    const initialState: DataSourceState = {
      datasets: [],
      currentDataset: null,
    };
    const store = mockStore(initialState);
    expect(store.getState()).toEqual(initialState);
  });

  it("Verifica che, il reperimento dei datasets, lo slice rilevante aggiorni il suo stato con i dati del dataset", () => {
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
      .route("http://localhost:3000/data-source", mockDatasets);

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

  it("Verifica che, dopo il tentativo di caricamento fallito del dataset, lo slice non cambi il suo stato iniziale", () => {
    const errorStatus: number = 500;
    const initialState: DataSourceState = {
      datasets: [],
      currentDataset: null,
    };
    fetchMock
      .mockGlobal()
      .route("http://localhost:3000/data-source", errorStatus);
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

  it("Verifica che, quando un dataset viene selezionato, lo slice rilevante aggiorni le informazioni del dataset selezionato", () => {
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

  it("Verifica che, quando un dataset non esiste, lo slice rilevante aggiorni le informazioni del dataset selezionato a null", () => {
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

  it("Verifica che sia possibile accedere alla lista dei dataset gestita dallo slice rilevante tramite il selettore appropriato.", () => {
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

    const mockState = createMockRootState(overrides);
    expect(selectorDatasets(mockState)).toEqual(overrides.dataSource.datasets);
  });

  it("Verifica che sia possibile accedere ai dati del dataset attualmente selezionato gestiti dallo slice rilevante tramite il selettore appropriato.", () => {
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

    const mockState = createMockRootState(overrides);
    expect(selectorCurrentDataset(mockState)).toEqual(
      overrides.dataSource.currentDataset,
    );
  });
});
