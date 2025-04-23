import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ApiSelector from "../../../src/components/apiSelector/apiSelector";
import { thunk } from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { AppDispatch, RootState } from "../../../src/app/Store";
import fetchMock from "fetch-mock";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router";
import { CreateMockRootState } from "../../utils/StateMockCreator";
import { DataSourceState } from "../../../src/features/DataSource/types/DataSourceState";
import { DatasetInfo } from "../../../src/features/DataSource/types/DatasetInfo";
import "@testing-library/jest-dom";
import React from "react";
import { findByText } from "@testing-library/react";

const middlewares = [thunk];
const mockStore = configureMockStore<RootState, AppDispatch>(middlewares);
const ROUTER_test = createBrowserRouter([
  {
    path: "/",
    Component: ApiSelector,
  },
]);

describe("ApiSelector", () => {
  beforeEach(() => {
    fetchMock.unmockGlobal();
    fetchMock.removeRoutes();
  });

  it("carica correttamente i dataset disponibili", async () => {
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
      <Provider store={mockStore(CreateMockRootState(overrides))}>
        <RouterProvider router={ROUTER_test} />
      </Provider>,
    );

    fireEvent.click(screen.getByText("Scegli una API..."));

    const option = await screen.findAllByRole("option");
    expect(option).toHaveLength(mockDatasets.length);
  });

  it("dovrebbe impostare correttamente il dataset selezionato", () => {});
});
