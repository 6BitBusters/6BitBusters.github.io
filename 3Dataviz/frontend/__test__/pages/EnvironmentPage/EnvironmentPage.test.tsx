import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { thunk } from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { AppDispatch, RootState } from "../../../src/app/Store";
import fetchMock from "fetch-mock";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router";
import { CreateMockRootState } from "../../utils/StateMockCreator";
import "@testing-library/jest-dom";
import React from "react";
import EnvironmentPage from "../../../src/pages/EnvironmentPage/EnvironmentPage";
import { DatasetInfo } from "../../../src/features/DataSource/types/DatasetInfo";
import { DataSourceState } from "../../../src/features/DataSource/types/DataSourceState";

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
  it("dovrebbe essere stato caricato correttamente il dataset", () => {
    const mockDatasets: DatasetInfo[] = [
      {
        id: 1,
        name: "API A",
        size: [1000, 2000],
        description: "Dati del meteo della città di Roma a Marzo 2025",
      },
      {
        id: 2,
        name: "API B",
        size: [1000, 2000],
        description: "Dati sui voli aerei degli ultimi 5 anni",
      },
      {
        id: 3,
        name: "API C",
        size: [1000, 2000],
        description: "Dati sui voli aerei degli ultimi 10 anni",
      },
    ];

    const overrides = {
      dataSource: {
        datasets: [],
        currentDataset: mockDatasets[0],
      } as DataSourceState,
    };

    const store = mockStore(CreateMockRootState(overrides));
    render(
      <Provider store={store}>
        <RouterProvider router={ROUTER_test} />
      </Provider>,
    );
    const state = store.getState();

    expect(
      screen.getByText(state.dataSource.currentDataset?.name),
    ).toBeInTheDocument();
  });
});
