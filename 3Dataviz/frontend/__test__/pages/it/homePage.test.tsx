import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "../../../src/pages/homePage/homePage";
import { thunk } from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { AppDispatch, RootState } from "../../../src/app/store";
import fetchMock from "fetch-mock";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router";
import { createMockRootState } from "../../utils/stateMockCreator";
import "@testing-library/jest-dom";
import React from "react";

const middlewares = [thunk];
const mockStore = configureMockStore<RootState, AppDispatch>(middlewares);
const ROUTER_test = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
]);

describe("HomePage", () => {
  beforeEach(() => {
    fetchMock.unmockGlobal();
    fetchMock.removeRoutes();
  });

  it("Verifica che l'AppStatus non contenga errori.", () => {
    const store = mockStore(createMockRootState());
    render(
      <Provider store={store}>
        <RouterProvider router={ROUTER_test} />
      </Provider>,
    );
    const state = store.getState();
    expect(state.appState.error).toEqual(null);
  });

  it("Verifica che la HomePage venga caricata correttamente.", () => {
    render(
      <Provider store={mockStore(createMockRootState())}>
        <RouterProvider router={ROUTER_test} />
      </Provider>,
    );

    expect(screen.getByText("3DataViz")).toBeInTheDocument();
  });

  it("Verifica che il componente ApiSelector venga caricato correttamente.", () => {
    render(
      <Provider store={mockStore(createMockRootState())}>
        <RouterProvider router={ROUTER_test} />
      </Provider>,
    );
    expect(screen.getByText("Scegli una API...")).toBeInTheDocument();
  });

  it("Verifica che il componente Footer venga caricato correttamente.", () => {
    render(
      <Provider store={mockStore(createMockRootState())}>
        <RouterProvider router={ROUTER_test} />
      </Provider>,
    );
    expect(screen.getByText(/Copyright/)).toBeInTheDocument();
  });
});
