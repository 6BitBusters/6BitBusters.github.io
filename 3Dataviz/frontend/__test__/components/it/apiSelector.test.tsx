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
import { DataSourceState } from "../../../src/features/dataSource/types/dataSourceState";
import { DatasetInfo } from "../../../src/features/dataSource/types/datasetInfo";
import "@testing-library/jest-dom";
import React from "react";
import EnvironmentPage from "../../../src/pages/environmentPage/environmentPage";

const middlewares = [thunk];
const mockStore = configureMockStore<RootState, AppDispatch>(middlewares);
const ROUTER_test = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/environment",
    Component: EnvironmentPage,
  },
]);

describe("ApiSelector", () => {
  beforeEach(() => {
    fetchMock.unmockGlobal();
    fetchMock.removeRoutes();
  });

  it("Verifica che i dataset disponibili vengano caricati correttamente.", async () => {
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
        datasets: mockDatasets,
        currentDataset: null,
      } as DataSourceState,
    };
    render(
      <Provider store={mockStore(createMockRootState(overrides))}>
        <RouterProvider router={ROUTER_test} />
      </Provider>,
    );

    expect(screen.getByTestId("form")).toHaveLength(mockDatasets.length);
  });
});
