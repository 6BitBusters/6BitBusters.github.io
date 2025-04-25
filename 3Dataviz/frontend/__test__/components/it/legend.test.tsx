import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { thunk } from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { AppDispatch, RootState } from "../../../src/app/store";
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

describe("Legend", () => {
  it("al caricamento dell`ambient 3D la legend deve essere corretta", async () => {
    render(
      <Provider
        store={mockStore(
          createMockRootState({
            data: {
              data: [],
              average: 0,
              legend: {
                x: "x",
                y: "y",
                z: "z",
              },
              x: [],
              z: [],
            },
            dataSource: {
              currentDataset: {
                id: 1,
                description: "",
                name: "",
                size: [1, 1],
              },
              datasets: [],
            },
          }),
        )}>
        <RouterProvider router={ROUTER_test} />
      </Provider>,
    );

    await waitFor(() => screen.getByTestId("legend"));
    expect(screen.getByText("x")).toBeInTheDocument();
    expect(screen.getByText("y")).toBeInTheDocument();
    expect(screen.getByText("z")).toBeInTheDocument();
  });
});
