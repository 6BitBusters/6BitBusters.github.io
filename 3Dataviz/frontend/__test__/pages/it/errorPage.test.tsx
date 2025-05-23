import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorPage from "../../../src/pages/errorPage/errorPage";
import { thunk } from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { AppDispatch, RootState } from "../../../src/app/store";
import fetchMock from "fetch-mock";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router";
import { createMockRootState } from "../../utils/stateMockCreator";
import "@testing-library/jest-dom";
import React from "react";
import { SerializedError } from "@reduxjs/toolkit";
import { AppState } from "../../../src/features/appStatus/types/appState";

const middlewares = [thunk];
const mockStore = configureMockStore<RootState, AppDispatch>(middlewares);
const ROUTER_test = createBrowserRouter([
  {
    path: "/",
    Component: ErrorPage,
  },
]);

describe("ErrorPage", () => {
  beforeEach(() => {
    fetchMock.unmockGlobal();
    fetchMock.removeRoutes();
  });

  it("Verifica che i dati dell'errore vengano caricati correttamente.", () => {
    const errorMock: SerializedError = {
      name: "Error",
      message: "Test error",
      code: "100",
    };
    const overrides = {
      appState: {
        error: errorMock,
        isLoading: false,
      } as AppState,
    };
    const store = mockStore(createMockRootState(overrides));
    render(
      <Provider store={store}>
        <RouterProvider router={ROUTER_test} />
      </Provider>,
    );

    const state = store.getState();
    expect(screen.getByText(state.appState.error?.name)).toBeInTheDocument();
    expect(screen.getByText(state.appState.error?.message)).toBeInTheDocument();
    expect(screen.getByText(state.appState.error?.code)).toBeInTheDocument();
  });
});
