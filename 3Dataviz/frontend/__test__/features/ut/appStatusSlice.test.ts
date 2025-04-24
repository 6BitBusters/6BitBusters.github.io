import { describe, it, expect, beforeEach } from "vitest";
import { AppState } from "../../../src/features/appStatus/types/appState";
import reducer, {
  selectorAppState,
} from "../../../src/features/appStatus/appSlice";
import { TooManyRequestsError } from "../../../src/features/appStatus/errors/tooManyRequestsError";
import { ServerError } from "../../../src/features/appStatus/errors/serverError";
import { NotFoundError } from "../../../src/features/appStatus/errors/notFoundError";
import { requestData } from "../../../src/features/data/dataSlice";
import {
  requestDatasets,
  setCurrentDataset,
} from "../../../src/features/dataSource/dataSourceSlice";
import { createMockRootState } from "../../utils/stateMockCreator";
import { serializeError } from "../../../src/features/appStatus/utils/errorSerializer";

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
      error: serializeError(new TooManyRequestsError()),
    };
    expect(
      reducer(initialState, {
        type: requestData.rejected.type,
        payload: errNo,
      }),
    ).toEqual(expectedState);
    expect(expectedState.error?.code).toEqual(errNo.toString());
    expect(expectedState.error?.message).toEqual(
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
      error: serializeError(new ServerError()),
    };
    expect(
      reducer(initialState, {
        type: requestData.rejected.type,
        payload: errNo,
      }),
    ).toEqual(expectedState);
    expect(expectedState.error?.code).toEqual(errNo.toString());
    expect(expectedState.error?.message).toEqual(
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
      error: serializeError(new NotFoundError()),
    };
    expect(
      reducer(initialState, {
        type: requestData.rejected.type,
        payload: errNo,
      }),
    ).toEqual(expectedState);
    expect(expectedState.error?.code).toEqual(errNo.toString());
    expect(expectedState.error?.message).toEqual("Non trovato");
  });
  it("Reperimento dei dataset fallito per 'server'", () => {
    const errNo: number = 500;
    const initialState: AppState = {
      isLoading: false,
      error: null,
    };
    const expectedState: AppState = {
      isLoading: false,
      error: serializeError(new ServerError()),
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
      error: serializeError(new NotFoundError()),
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
      } as AppState,
    };
    const mockState = createMockRootState(overrides);
    expect(selectorAppState(mockState)).toEqual(overrides.appState);
  });
});
