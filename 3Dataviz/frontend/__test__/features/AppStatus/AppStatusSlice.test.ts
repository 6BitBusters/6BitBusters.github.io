import { describe, it, expect, beforeEach } from "vitest";
import { AppState } from "../../../src/features/AppStatus/types/AppState";
import reducer, {
  selectorAppState,
} from "../../../src/features/AppStatus/AppSlice";
import { TooManyRequestsError } from "../../../src/features/AppStatus/Errors/TooManyRequestsError";
import { ServerError } from "../../../src/features/AppStatus/Errors/ServerError";
import { NotFoundError } from "../../../src/features/AppStatus/Errors/NotFoundError";
import { requestData } from "../../../src/features/Data/DataSlice";
import {
  requestDatasets,
  setCurrentDataset,
} from "../../../src/features/DataSource/DataSourceSlice";
import { createMockRootState } from "../../utils/StatesMockCreator";

describe("AppStateSlice", () => {
  it("Reperimento dei dati del dataset in corso", () => {
    const initialState: AppState = {
      isLoading: false,
      error: null,
    };
    const expectedState: AppState = {
      isLoading: true,
      error: null,
    };
    expect(
      reducer(initialState, { type: requestData.pending.type, payload: null }),
    ).toEqual(expectedState);
  });
  it("Reperimento dei dati del dataset completato con successo", () => {
    const initialState: AppState = {
      isLoading: true,
      error: null,
    };
    const expectedState: AppState = {
      isLoading: false,
      error: null,
    };
    expect(
      reducer(initialState, {
        type: requestData.fulfilled.type,
        payload: null,
      }),
    ).toEqual(expectedState);
  });
  it("Reset dello stato mentre faccio una nuova request", () => {
    const initialState: AppState = {
      isLoading: true,
      error: new ServerError(),
    };
    const expectedState: AppState = {
      isLoading: true,
      error: null,
    };
    // request dei dati del dataset
    expect(
      reducer(initialState, { type: requestData.pending.type, payload: null }),
    ).toEqual(expectedState);
    // request dei dataset
    expect(
      reducer(initialState, {
        type: requestDatasets.pending.type,
        payload: null,
      }),
    ).toEqual(expectedState);
  });
  it("Reperimento dei dati del dataset fallito per 'maxrequest'", () => {
    // 429 => TooManyRequestsError()
    const errNo: number = 429;
    const initialState: AppState = {
      isLoading: true,
      error: null,
    };
    const expectedState: AppState = {
      isLoading: false,
      error: new TooManyRequestsError(),
    };
    expect(
      reducer(initialState, {
        type: requestData.rejected.type,
        payload: errNo,
      }),
    ).toEqual(expectedState);
    expect(expectedState.error?.getErrNo()).toEqual(errNo);
    expect(expectedState.error?.getErrorMessage()).toEqual(
      "Numero massimo di richieste API effettuate",
    );
  });
  it("Reperimento dei dati del dataset fallito per 'server'", () => {
    // 500 => ServerError()
    const errNo: number = 500;
    const initialState: AppState = {
      isLoading: true,
      error: null,
    };
    const expectedState: AppState = {
      isLoading: false,
      error: new ServerError(),
    };
    expect(
      reducer(initialState, {
        type: requestData.rejected.type,
        payload: errNo,
      }),
    ).toEqual(expectedState);
    expect(expectedState.error?.getErrNo()).toEqual(errNo);
    expect(expectedState.error?.getErrorMessage()).toEqual(
      "Errore di connessione al server",
    );
  });
  it("Reperimento dei dati del dataset fallito per 'network'", () => {
    // 404 => NotFoundError()
    const errNo: number = 404;
    const initialState: AppState = {
      isLoading: true,
      error: null,
    };
    const expectedState: AppState = {
      isLoading: false,
      error: new NotFoundError(),
    };
    expect(
      reducer(initialState, {
        type: requestData.rejected.type,
        payload: errNo,
      }),
    ).toEqual(expectedState);
    expect(expectedState.error?.getErrNo()).toEqual(errNo);
    expect(expectedState.error?.getErrorMessage()).toEqual("Non trovato");
  });
  it("Reperimento dei dataset fallito per 'server'", () => {
    const errNo: number = 500;
    const initialState: AppState = {
      isLoading: false,
      error: null,
    };
    const expectedState: AppState = {
      isLoading: false,
      error: new ServerError(),
    };
    expect(
      reducer(initialState, {
        type: requestDatasets.rejected.type,
        payload: errNo,
      }),
    ).toEqual(expectedState);
  });
  it("Selezionato dataset non esistente", () => {
    const initialState: AppState = {
      isLoading: false,
      error: null,
    };
    const expectedState: AppState = {
      isLoading: false,
      error: new NotFoundError(),
    };
    expect(reducer(initialState, setCurrentDataset(undefined))).toEqual(
      expectedState,
    );
  });
  it("Prendere lo stato", () => {
    const overrides = {
      appState: {
        isLoading: true,
        error: null,
      } as AppState
    }
    const mockState = createMockRootState(overrides)
    expect(selectorAppState(mockState)).toEqual(overrides.appState);
  });
});
