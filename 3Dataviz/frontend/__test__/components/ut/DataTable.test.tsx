import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DataTable from "../../../src/components/UI/dataTable/dataTable";
import React from "react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import { AppDispatch, RootState } from "../../../src/app/store";
import { createMockRootState } from "../../utils/stateMockCreator";
import gsap from "gsap";

const middlewares = [thunk];
const mockStore = configureMockStore<RootState, AppDispatch>(middlewares);

describe("DataTable", () => {
  it("La tebella deve essere visibile al caricamento del dataset", async () => {
    render(
      <Provider store={mockStore(createMockRootState())}>
        <DataTable />
      </Provider>,
    );
    await waitFor(() => screen.getByTestId("table-container"));
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("La tabella deve aprirsi quando si clicca sul bottone apposito", async () => {
    render(
      <Provider store={mockStore(createMockRootState())}>
        <DataTable />
      </Provider>,
    );
    const gsapToSpy = vi.spyOn(gsap, "to");
    await waitFor(() => screen.getByTestId("table-container"));
    const expandInput = screen.getByTestId("expand-btn").children[0];
    await fireEvent.click(expandInput);
    expect(gsapToSpy).toHaveBeenCalledTimes(1);
    expect(gsapToSpy).toHaveBeenCalledWith("#table-container", {
      y: -325,
      x: 0,
      duration: 0.7,
      ease: "elastic.out(0.5,0.8)",
      delay: 0,
      overwrite: false,
    });
  });

  it("La tabella deve chiudersi quando si clicca sul bottone apposito", async () => {
    render(
      <Provider store={mockStore(createMockRootState())}>
        <DataTable />
      </Provider>,
    );
    const gsapToSpy = vi.spyOn(gsap, "to");
    await waitFor(() => screen.getByTestId("table-container"));
    const expandInput = screen.getByTestId("expand-btn").children[0];
    await fireEvent.click(expandInput);
    await fireEvent.click(expandInput);
    expect(gsapToSpy).toHaveBeenCalledTimes(2);
    expect(gsapToSpy).toHaveBeenNthCalledWith(2, "#table-container", {
      y: 0,
      x: 0,
      duration: 0.6,
      ease: "power4.out",
      delay: 0,
      overwrite: false,
    });
  });

  it("La la cella cliccata deve generare un dispatch di tipo filterByValue per i valori inferiori", async () => {
    const dispatch = vi.fn();
    const store = mockStore(
      createMockRootState({
        data: {
          data: [{ id: 1, show: true, x: 0, y: 1, z: 0 }],
          average: 1,
          legend: null,
          x: [""],
          z: [""],
        },
      }),
    );
    render(
      <Provider store={{ ...store, dispatch }}>
        <DataTable />
      </Provider>,
    );
    await waitFor(() => screen.getByTestId("table-container"));
    const cell = screen.getByTestId("0");
    fireEvent.click(cell);
    expect(dispatch).toHaveBeenCalledWith({
      type: "data/filterByValue",
      payload: { isGreater: false, value: 1 },
    });
  });

  it("La la cella cliccata deve generare un dispatch di tipo filterByValue per i valori superiori", async () => {
    const dispatch = vi.fn();
    const store = mockStore(
      createMockRootState({
        data: {
          data: [{ id: 1, show: true, x: 0, y: 1, z: 0 }],
          average: 1,
          legend: null,
          x: [""],
          z: [""],
        },
        filterOption: {
          isGreater: true,
        },
      }),
    );
    render(
      <Provider store={{ ...store, dispatch }}>
        <DataTable />
      </Provider>,
    );
    await waitFor(() => screen.getByTestId("table-container"));
    const cell = screen.getByTestId("0");
    fireEvent.click(cell);
    expect(dispatch).toHaveBeenCalledWith({
      type: "data/filterByValue",
      payload: { isGreater: true, value: 1 },
    });
  });
});
