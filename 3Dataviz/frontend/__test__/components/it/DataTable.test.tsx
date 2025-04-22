import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DataTable from "../../../src/components/UI/DataTable/DataTable";
import React from "react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import { AppDispatch, RootState } from "../../../src/app/Store";
import { CreateMockRootState } from "../../utils/StateMockCreator";
import dataSlice from "../../../src/features/Data/DataSlice";
import { configureStore } from "@reduxjs/toolkit";
import filterOptionSlice from "../../../src/features/FilterOption/FilterOptionSlice";

const middlewares = [thunk];
const mockStore = configureMockStore<RootState, AppDispatch>(middlewares);

describe("DataTable", () => {
  it("la cella con un valore non filtrato deve essere visibile e avere la corretta classe i highlight", async () => {
    render(
      <Provider
        store={mockStore(
          CreateMockRootState({
            data: {
              data: [{ id: 1, show: true, x: 0, y: 1, z: 0 }],
              average: 1,
              legend: null,
              x: [""],
              z: [""],
            },
          }),
        )}>
        <DataTable />
      </Provider>,
    );
    await waitFor(() => screen.getByTestId("table-container"));
    const cell = screen.getByTestId("0");
    expect(cell.className).toBe("hcell");
    expect(screen.getByTestId("0")).toBeInTheDocument();
  });

  it("la cella con un valore filtrato deve essere visibile e senza highlight", async () => {
    render(
      <Provider
        store={mockStore(
          CreateMockRootState({
            data: {
              data: [{ id: 1, show: false, x: 0, y: 1, z: 0 }],
              average: 1,
              legend: null,
              x: [""],
              z: [""],
            },
          }),
        )}>
        <DataTable />
      </Provider>,
    );
    await waitFor(() => screen.getByTestId("table-container"));
    const cell = screen.getByTestId("0");
    expect(cell.className).toBe("nhcell");
    expect(screen.getByTestId("0")).toBeInTheDocument();
  });

  it("una cella con il valore piu` alto rispetto a quella cliccata deve cambiare stile in quanto filtrata", async () => {
    const states = CreateMockRootState({
      data: {
        data: [
          { id: 1, show: true, x: 0, y: 1, z: 0 },
          { id: 2, show: true, x: 0, y: 5, z: 1 },
        ],
        average: 1,
        legend: null,
        x: [""],
        z: [""],
      },
    });
    const store = configureStore({
      reducer: {
        data: dataSlice,
        filterOption: filterOptionSlice,
      },
      preloadedState: { data: states.data },
    });
    render(
      <Provider store={store}>
        <DataTable />
      </Provider>,
    );
    await waitFor(() => screen.getByTestId("table-container"));
    expect(screen.getByTestId("0").className).toBe("hcell");
    fireEvent.click(screen.getByTestId("0"));
    expect(screen.getByTestId("1").className).toBe("nhcell");
    expect(screen.getByTestId("0").className).toBe("hcell");
  });

  it("una cella con il valore piu` basso rispetto a quella cliccata deve cambiare stile in quanto filtrata", async () => {
    const states = CreateMockRootState({
      data: {
        data: [
          { id: 1, show: true, x: 0, y: 1, z: 0 },
          { id: 2, show: true, x: 0, y: 0, z: 1 },
        ],
        average: 1,
        legend: null,
        x: [""],
        z: [""],
      },
      filterOption: {
        isGreater: true,
      },
    });
    const store = configureStore({
      reducer: {
        data: dataSlice,
        filterOption: filterOptionSlice,
      },
      preloadedState: { data: states.data, filterOption: states.filterOption },
    });
    render(
      <Provider store={store}>
        <DataTable />
      </Provider>,
    );
    await waitFor(() => screen.getByTestId("table-container"));
    expect(screen.getByTestId("0").className).toBe("hcell");
    fireEvent.click(screen.getByTestId("0"));
    expect(screen.getByTestId("1").className).toBe("nhcell");
    expect(screen.getByTestId("0").className).toBe("hcell");
  });
});
