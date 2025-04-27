import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DataTable from "../../../src/components/UI/dataTable/dataTable";
import React from "react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import { AppDispatch, RootState } from "../../../src/app/store";
import { createMockRootState } from "../../utils/stateMockCreator";
import dataSlice from "../../../src/features/data/dataSlice";
import { configureStore } from "@reduxjs/toolkit";
import filterOptionSlice from "../../../src/features/filterOption/filterOptionSlice";

const middlewares = [thunk];
const mockStore = configureMockStore<RootState, AppDispatch>(middlewares);

describe("DataTable", () => {
  it("Verifica che una cella contenente un valore non filtrato sia visibile e che le venga applicata la classe CSS 'highlight'", async () => {
    render(
      <Provider
        store={mockStore(
          createMockRootState({
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

  it("Verifica che una cella contenente un valore filtrato non sia visibile e non abbia la classe CSS 'highlight'", async () => {
    render(
      <Provider
        store={mockStore(
          createMockRootState({
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

  it("Verifica che, dopo aver cliccato una cella, ogni altra cella con un valore numericamente maggiore cambi stile in quanto considerata filtrata.", async () => {
    const states = createMockRootState({
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

  it("Verifica che, dopo aver cliccato una cella, ogni altra cella con un valore numericamente inferiore cambi stile in quanto considerata filtrata.", async () => {
    const states = createMockRootState({
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
