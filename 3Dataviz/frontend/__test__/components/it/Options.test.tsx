import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Options from "../../../src/components/UI/Options/Options";
import React from "react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import { AppDispatch, RootState } from "../../../src/app/Store";
import { CreateMockRootState } from "../../utils/StateMockCreator";
import DataTable from "../../../src/components/UI/DataTable/DataTable";
import { configureStore } from "@reduxjs/toolkit";
import filterOptionSlice from "../../../src/features/FilterOption/FilterOptionSlice";
import dataSlice from "../../../src/features/Data/DataSlice";

const middlewares = [thunk];
const mockStore = configureMockStore<RootState, AppDispatch>(middlewares);

describe("DataTable", () => {
  describe("Filter", () => {
    it("quando eseguo un filtraggio per i valori inferiori al valor medio le celle della tabella devono avere la classe css corretta", async () => {
      const states = CreateMockRootState({
        data: {
          data: [
            { id: 1, show: true, x: 0, y: 1, z: 0 },
            { id: 2, show: true, x: 0, y: 5, z: 1 },
          ],
          average: 3,
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
          <Options />
          <DataTable />
        </Provider>,
      );
      await waitFor(() => screen.getByTestId("option-container"));
      await waitFor(() => screen.getByTestId("table-container"));
      const filterBtn = screen.getAllByTestId("do-filter")[0];
      fireEvent.click(filterBtn);
      expect(screen.getByTestId("0").className).toBe("hcell");
      expect(screen.getByTestId("1").className).toBe("nhcell");
    });

    it("quando eseguo un filtraggio per i valori superiori al valor medio le celle della tabella devono avere la classe css corretta", async () => {
      const states = CreateMockRootState({
        data: {
          data: [
            { id: 1, show: true, x: 0, y: 1, z: 0 },
            { id: 2, show: true, x: 0, y: 5, z: 1 },
          ],
          average: 3,
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
        preloadedState: {
          data: states.data,
          filterOption: states.filterOption,
        },
      });

      render(
        <Provider store={store}>
          <Options />
          <DataTable />
        </Provider>,
      );
      await waitFor(() => screen.getByTestId("option-container"));
      await waitFor(() => screen.getByTestId("table-container"));
      const filterBtn = screen.getAllByTestId("do-filter")[0];
      fireEvent.click(filterBtn);
      expect(screen.getByTestId("0").className).toBe("nhcell");
      expect(screen.getByTestId("1").className).toBe("hcell");
    });
  });

  describe("NFilter", () => {
    it("quando eseguo un filtraggio per i bottom 2 valori le celle della tabella devono avere la classe css corretta", async () => {
      const states = CreateMockRootState({
        data: {
          data: [
            { id: 1, show: true, x: 0, y: 1, z: 0 },
            { id: 2, show: true, x: 0, y: 5, z: 1 },
            { id: 3, show: true, x: 0, y: 3, z: 2 },
          ],
          average: 3,
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
          <Options />
          <DataTable />
        </Provider>,
      );
      await waitFor(() => screen.getByTestId("option-container"));
      await waitFor(() => screen.getByTestId("table-container"));
      const filterBtn = screen.getAllByTestId("do-filter")[1];
      const inputValue = screen.getByTestId("N-filter-value");
      fireEvent.change(inputValue, { target: { value: 2 } });
      fireEvent.click(filterBtn);
      expect(screen.getByTestId("0").className).toBe("hcell");
      expect(screen.getByTestId("1").className).toBe("nhcell");
      expect(screen.getByTestId("2").className).toBe("hcell");
    });

    it("quando eseguo un filtraggio per i top 2 valori le celle della tabella devono avere la classe css corretta", async () => {
      const states = CreateMockRootState({
        data: {
          data: [
            { id: 1, show: true, x: 0, y: 1, z: 0 },
            { id: 2, show: true, x: 0, y: 5, z: 1 },
            { id: 3, show: true, x: 0, y: 3, z: 2 },
          ],
          average: 3,
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
        preloadedState: {
          data: states.data,
          filterOption: states.filterOption,
        },
      });

      render(
        <Provider store={store}>
          <Options />
          <DataTable />
        </Provider>,
      );
      await waitFor(() => screen.getByTestId("option-container"));
      await waitFor(() => screen.getByTestId("table-container"));
      const filterBtn = screen.getAllByTestId("do-filter")[1];
      const inputValue = screen.getByTestId("N-filter-value");
      fireEvent.change(inputValue, { target: { value: 2 } });
      fireEvent.click(filterBtn);
      expect(screen.getByTestId("0").className).toBe("nhcell");
      expect(screen.getByTestId("1").className).toBe("hcell");
      expect(screen.getByTestId("2").className).toBe("hcell");
    });
  });

  describe("ResetFilter", () => {
    it("quando eseguo il reset dei filtri le celle della tabella devono avere la classe css corretta", async () => {
      const states = CreateMockRootState({
        data: {
          data: [
            { id: 1, show: true, x: 0, y: 1, z: 0 },
            { id: 2, show: false, x: 0, y: 5, z: 1 },
            { id: 3, show: false, x: 0, y: 3, z: 2 },
          ],
          average: 3,
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
          <Options />
          <DataTable />
        </Provider>,
      );
      await waitFor(() => screen.getByTestId("option-container"));
      await waitFor(() => screen.getByTestId("table-container"));
      const resetBtn = screen.getByTestId("reset-filter");
      fireEvent.click(resetBtn);
      expect(screen.getByTestId("0").className).toBe("hcell");
      expect(screen.getByTestId("1").className).toBe("hcell");
      expect(screen.getByTestId("2").className).toBe("hcell");
    });
  });
});
