import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { thunk } from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { AppDispatch, RootState } from "../../../src/app/store";
import fetchMock from "fetch-mock";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router";
import { createMockRootState } from "../../utils/stateMockCreator";
import "@testing-library/jest-dom";
import React from "react";
import EnvironmentPage from "../../../src/pages/environmentPage/environmentPage";

const middlewares = [thunk];
const mockStore = configureMockStore<RootState, AppDispatch>(middlewares);
const ROUTER_test = createBrowserRouter([
  {
    path: "/",
    Component: EnvironmentPage,
  },
]);

describe("EnvironmentPage", () => {
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
});
