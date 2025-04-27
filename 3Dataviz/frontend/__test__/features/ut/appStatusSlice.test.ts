import { describe, it, expect, beforeEach } from "vitest";
import { AppState } from "../../../src/features/appStatus/types/appState";
import reducer, {
  resetError,
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
  it("Verifica che, durante il reperimento dei dati del dataset, lo slice rilevante aggiorni il suo stato impostando un flag di caricamento.", () => {
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
  it("Verifica che, durante il reperimento del dataset, lo slice rilevante aggiorni il suo stato impostando un flag di caricamento.", () => {
    const initialState: AppState = {
      isLoading: false,
      error: null,
    };
    const expectedState: AppState = {
      isLoading: true,
      error: null,
    };
    expect(
      reducer(initialState, {
        type: requestDatasets.pending.type,
        payload: null,
      }),
    ).toEqual(expectedState);
  });
  it("Verifica che, al completamento con successo del reperimento dei dati del dataset, lo slice rilevante aggiorni il suo stato con i dati ricevuti e resetti il flag di caricamento", () => {
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
  it("Verifica che, al completamento con successo del reperimento del dataset, lo slice rilevante aggiorni il suo stato con i dati ricevuti e resetti il flag di caricamento", () => {
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
        type: requestDatasets.fulfilled.type,
        payload: null,
      }),
    ).toEqual(expectedState);
  });
  it("Verifica che, quando viene avviata una nuova richiesta di dati, lo slice rilevante resetti il suo stato", () => {
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
  it("Verifica che, quando viene attivata l'azione di reset manuale degli errori, lo slice rilevante riporti il suo stato dei dati al valore iniziale", () => {
    const initialState: AppState = {
      isLoading: true,
      error: new ServerError(),
    };
    const expectedState: AppState = {
      isLoading: true,
      error: null,
    };
    // request dei dati del dataset
    expect(reducer(initialState, resetError())).toEqual(expectedState);
  });
  it("Verifica che, in caso di fallimento del reperimento dei dati del dataset per 'maxrequest', lo slice rilevante imposti il suo stato di errore con un messaggio appropriato", () => {
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
  it("Verifica che, in caso di fallimento del reperimento dei dati del dataset per 'server', lo slice rilevante imposti il suo stato di errore con un messaggio appropriato", () => {
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
  it("Verifica che, in caso di fallimento del reperimento dei dati del dataset per 'network', lo slice rilevante imposti il suo stato di errore con un messaggio appropriato", () => {
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
  it("Verifica che, in caso di fallimento del reperimento dei dataset per 'server', lo slice rilevante imposti il suo stato di errore con un messaggio appropriato", () => {
    const errNo: number = 503;
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
  it("Verifica che, quando viene selezionato un dataset non esistente, lo slice rilevante imposti il suo stato di errore con un messaggio appropriato", () => {
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
  it("Verifica che sia possibile accedere allo stato gestito dallo slice rilevante tramite il selettore appropriato.", () => {
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
