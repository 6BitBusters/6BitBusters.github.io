import { describe, it, expect, beforeEach } from "vitest";
import { AppState } from "../../../src/features/AppStatus/types/AppState";
import reducer, {
  setLoading,
  setError,
  selectorAppState,
} from "../../../src/features/AppStatus/AppStatusSlice";
import { MaxRequestError } from "../../../src/features/AppStatus/Errors/MaxRequestError";
import { ServerError } from "../../../src/features/AppStatus/Errors/ServerError";
import { NetworkError } from "../../../src/features/AppStatus/Errors/NetworkError";

describe("AppStateSlice", () => {
  it("Imposta lo stato di caricamento a 'true'", () => {
    const initialState: AppState = {
      isLoading: false,
      error: null,
    };
    const expectedState: AppState = {
      isLoading: true,
      error: null,
    };
    expect(reducer(initialState, setLoading(true))).toEqual(expectedState);
  });
  it("Imposta lo stato di caricamento a 'false'", () => {
    const initialState: AppState = {
      isLoading: true,
      error: null,
    };
    const expectedState: AppState = {
      isLoading: false,
      error: null,
    };
    expect(reducer(initialState, setLoading(false))).toEqual(expectedState);
  });
  it("Imposta lo stato di caricamento a seguito di un errore", () => {
    const initialState: AppState = {
      isLoading: false,
      error: new ServerError(),
    };
    const expectedState: AppState = {
      isLoading: true,
      error: null,
    };
    expect(reducer(initialState, setLoading(true))).toEqual(expectedState);
  });
  it("Imposta un errore di 'maxrequest'", () => {
    const initialState: AppState = {
      isLoading: true,
      error: null,
    };
    const expectedState: AppState = {
      isLoading: false,
      error: new MaxRequestError(),
    };
    expect(reducer(initialState, setError(429))).toEqual(expectedState);
  });
  it("Imposta un errore di 'server'", () => {
    const initialState: AppState = {
      isLoading: true,
      error: null,
    };
    const expectedState: AppState = {
      isLoading: false,
      error: new ServerError(),
    };
    expect(reducer(initialState, setError(500))).toEqual(expectedState);
  });
  it("Imposta un errore di 'network'", () => {
    const initialState: AppState = {
      isLoading: true,
      error: null,
    };
    const expectedState: AppState = {
      isLoading: false,
      error: new NetworkError(),
    };
    expect(reducer(initialState, setError(404))).toEqual(expectedState);
    // codice di errore non conosciuto
    expect(reducer(initialState, setError(1))).toEqual(expectedState);
  });
  it("Prendere lo stato", () => {
    const state: AppState = {
      isLoading: true,
      error: null,
    };
    expect(selectorAppState({ appState: state })).toEqual(state);
  });
});
