import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import EnvironmentPage from "../../../src/pages/environmentPage/environmentPage";
import React from "react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import { AppDispatch, RootState } from "../../../src/app/store";
import { createMockRootState } from "../../utils/stateMockCreator";
import { createBrowserRouter, RouterProvider } from "react-router";

const middlewares = [thunk];
const mockStore = configureMockStore<RootState, AppDispatch>(middlewares);
const ROUTER_test = createBrowserRouter([
  {
    path: "/",
    Component: EnvironmentPage,
  },
]);

describe("CurrentDatasetLabel", () => {
  it("Verifica che durante il caricamento del dataset, sia visibile il testo di caricamento.", async () => {
    render(
      <Provider
        store={mockStore(
          createMockRootState({
            appState: {
              isLoading: true,
              error: null,
            },
            dataSource: {
              datasets: [],
              currentDataset: {
                id: 1,
                description: "",
                name: "",
                size: [1, 1],
              },
            },
          }),
        )}>
        <RouterProvider router={ROUTER_test} />
      </Provider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("loader")).toBeInTheDocument();
    });
  });
  it("Verifica che al termine del caricamento del dataset, il testo di caricamento non sia più visibile.", async () => {
    render(
      <Provider
        store={mockStore(
          createMockRootState({
            appState: {
              isLoading: false,
              error: null,
            },
            dataSource: {
              datasets: [],
              currentDataset: {
                id: 1,
                description: "",
                name: "",
                size: [1, 1],
              },
            },
          }),
        )}>
        <RouterProvider router={ROUTER_test} />
      </Provider>,
    );
    await waitFor(() => {
      expect(screen.queryByTestId("loader")).toBeNull();
      expect(screen.getByTestId("canvas")).toBeInTheDocument();
    });
  });
});
