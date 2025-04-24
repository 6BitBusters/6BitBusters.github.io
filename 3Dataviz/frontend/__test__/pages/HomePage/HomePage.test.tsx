import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "../../../src/pages/homePage/homePage";
import { thunk } from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { AppDispatch, RootState } from "../../../src/app/Store";
import fetchMock from "fetch-mock";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router";
import { CreateMockRootState } from "../../utils/StateMockCreator";
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

  it("Non dovrebbero esserci errori nell'AppStatus", () => {
    const store = mockStore(CreateMockRootState());
    render(
      <Provider store={store}>
        <RouterProvider router={ROUTER_test} />
      </Provider>,
    );
    const state = store.getState();
    expect(state.appState.error).toEqual(null);
  });

  it("dovrebbe caricare correttamente la HomePage", () => {
    render(
      <Provider store={mockStore(CreateMockRootState())}>
        <RouterProvider router={ROUTER_test} />
      </Provider>,
    );

    expect(screen.getByText("3DataViz")).toBeInTheDocument();
  });

  it("dovrebbe caricare correttamente ApiSelector", () => {
    render(
      <Provider store={mockStore(CreateMockRootState())}>
        <RouterProvider router={ROUTER_test} />
      </Provider>,
    );
    expect(screen.getByText("Scegli una API...")).toBeInTheDocument();
  });

  it("dovrebbe caricare correttamente Footer", () => {
    render(
      <Provider store={mockStore(CreateMockRootState())}>
        <RouterProvider router={ROUTER_test} />
      </Provider>,
    );
    expect(screen.getByText(/Copyright/)).toBeInTheDocument();
  });
});
