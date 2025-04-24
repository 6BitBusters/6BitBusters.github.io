import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Options from "../../../src/components/UI/options/options";
import React from "react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import { AppDispatch, RootState } from "../../../src/app/store";
import { createMockRootState } from "../../utils/stateMockCreator";
import gsap from "gsap";

const middlewares = [thunk];
const mockStore = configureMockStore<RootState, AppDispatch>(middlewares);

describe("Options", () => {
  it("le opzioni devono aprirsi quando si clicca sul bottone apposito", async () => {
    render(
      <Provider store={mockStore(createMockRootState())}>
        <Options />
      </Provider>,
    );
    const gsapToSpy = vi.spyOn(gsap, "to");
    await waitFor(() => screen.getByTestId("option-container"));
    const expandInput = screen.getByTestId("expand-btn").children[1];
    await fireEvent.click(expandInput);
    expect(gsapToSpy).toHaveBeenCalledTimes(1);
    expect(gsapToSpy).toHaveBeenCalledWith("#option-container", {
      y: 0,
      x: -470,
      duration: 0.7,
      ease: "elastic.out(0.5,0.8)",
      delay: 0,
      overwrite: false,
    });
  });

  it("La tabella deve chiudersi quando si clicca sul bottone apposito", async () => {
    render(
      <Provider store={mockStore(createMockRootState())}>
        <Options />
      </Provider>,
    );
    const gsapToSpy = vi.spyOn(gsap, "to");
    await waitFor(() => screen.getByTestId("option-container"));
    const expandInput = screen.getByTestId("expand-btn").children[0];
    await fireEvent.click(expandInput);
    await fireEvent.click(expandInput);
    expect(gsapToSpy).toHaveBeenCalledTimes(2);
    expect(gsapToSpy).toHaveBeenNthCalledWith(2, "#option-container", {
      y: 0,
      x: 0,
      duration: 0.6,
      ease: "power4.out",
      delay: 0,
      overwrite: false,
    });
  });

  describe("Filter", () => {
    it("la Ui per il filtraggio rispetto al valor medio globale deve essere visibile al caricamento del dataset", async () => {
      render(
        <Provider store={mockStore(createMockRootState())}>
          <Options />
        </Provider>,
      );
      await waitFor(() => screen.getByTestId("option-container"));
      expect(screen.getAllByTestId("average-filter")[0]).toBeInTheDocument();
    });

    it("la Ui per il filtraggio rispetto al valor medio globale deve essere visibile al caricamento del dataset", async () => {
      render(
        <Provider store={mockStore(createMockRootState())}>
          <Options />
        </Provider>,
      );
      await waitFor(() => screen.getByTestId("option-container"));
      expect(screen.getAllByTestId("average-filter")[0]).toBeInTheDocument();
    });

    it("il bottone deve eseguire il filtraggio rispetto al valor medio (inferiori)", async () => {
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
          <Options />
        </Provider>,
      );
      await waitFor(() => screen.getByTestId("option-container"));
      const btn = screen.getAllByTestId("do-filter")[0];
      fireEvent.click(btn);
      expect(dispatch).toHaveBeenCalledWith({
        type: "data/filterByAverage",
        payload: false,
      });
    });
    it("il bottone deve eseguire il filtraggio rispetto al valor medio (superiori)", async () => {
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
          <Options />
        </Provider>,
      );
      await waitFor(() => screen.getByTestId("option-container"));
      const btn = screen.getAllByTestId("do-filter")[0];
      fireEvent.click(btn);
      expect(dispatch).toHaveBeenCalledWith({
        type: "data/filterByAverage",
        payload: true,
      });
    });
  });

  describe("NFilter", () => {
    it("la Ui per il filtraggio per i top e bottom N deve essere visibile al caricamento del dataset", async () => {
      render(
        <Provider store={mockStore(createMockRootState())}>
          <Options />
        </Provider>,
      );
      await waitFor(() => screen.getByTestId("option-container"));
      expect(screen.getAllByTestId("N-filter")[0]).toBeInTheDocument();
    });
    it("il bottone deve eseguire il filtraggio dei bottom N valori", async () => {
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
          <Options />
        </Provider>,
      );
      await waitFor(() => screen.getByTestId("option-container"));
      const btn = screen.getAllByTestId("do-filter")[1];
      const input = screen.getByTestId("N-filter-value") as HTMLInputElement;
      fireEvent.click(btn);
      expect(dispatch).toHaveBeenCalledWith({
        type: "data/filterFirstN",
        payload: { isGreater: false, value: parseInt(input.value, 10) },
      });
    });
    it("il bottone deve eseguire il filtraggio dei top N valori", async () => {
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
          <Options />
        </Provider>,
      );
      await waitFor(() => screen.getByTestId("option-container"));
      const btn = screen.getAllByTestId("do-filter")[1];
      const input = screen.getByTestId("N-filter-value") as HTMLInputElement;
      fireEvent.click(btn);
      expect(dispatch).toHaveBeenCalledWith({
        type: "data/filterFirstN",
        payload: { isGreater: true, value: parseInt(input.value, 10) },
      });
    });
    it("il bottone deve eseguire il filtraggio dei top o bottom 0 valori se il valore inserito non e` un numero o e` <0", async () => {
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
          <Options />
        </Provider>,
      );
      await waitFor(() => screen.getByTestId("option-container"));
      const btn = screen.getAllByTestId("do-filter")[1];
      const input = screen.getByTestId("N-filter-value") as HTMLInputElement;
      fireEvent.change(input, { target: { value: -1 } });
      fireEvent.click(btn);
      expect(dispatch).toHaveBeenCalledWith({
        type: "data/filterFirstN",
        payload: { isGreater: true, value: 0 },
      });
    });
  });

  describe("FilterModOptions", () => {
    it("la Ui per cambiare le opzioni di filtraggio siano visibili al caricamento del dataset", async () => {
      render(
        <Provider store={mockStore(createMockRootState())}>
          <Options />
        </Provider>,
      );
      await waitFor(() => screen.getByTestId("option-container"));
      expect(screen.getByTestId("filter-options")).toBeInTheDocument();
    });
    it("quando cambio l`algoritmo di filtraggio in superiore il componente deve aggiornare lo stato con la relativa action", async () => {
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
          <Options />
        </Provider>,
      );
      await waitFor(() => screen.getByTestId("option-container"));
      const btn = screen.getByTestId("filter-sup");
      fireEvent.click(btn);
      expect(dispatch).toHaveBeenCalledWith({
        type: "filterOptionSlice/toggleIsGreater",
        payload: true,
      });
    });
    it("quando cambio l`algoritmo di filtraggio in inferiori il componente deve aggiornare lo stato con la relativa action", async () => {
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
          <Options />
        </Provider>,
      );
      await waitFor(() => screen.getByTestId("option-container"));
      const sup = screen.getByTestId("filter-sup");
      fireEvent.click(sup);
      const btn = screen.getByTestId("filter-inf");
      fireEvent.click(btn);
      expect(dispatch).toHaveBeenCalledWith({
        type: "filterOptionSlice/toggleIsGreater",
        payload: true,
      });
    });
  });

  describe("AveragePlaneOption", () => {
    it("la Ui per cambiare le opzioni di visualizzazione del piano medio siano visibili al caricamento del dataset", async () => {
      render(
        <Provider store={mockStore(createMockRootState())}>
          <Options />
        </Provider>,
      );
      await waitFor(() => screen.getByTestId("option-container"));
      expect(screen.getByTestId("plane-view")).toBeInTheDocument();
    });

    it("quando cambio la visibilita` in 'abilitato' del piano medio globale il componente richiami la action corretta per aggiornare lo stato", async () => {
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
          <Options />
        </Provider>,
      );
      await waitFor(() => screen.getByTestId("option-container"));
      const btn = screen.getByTestId("plane-active");
      fireEvent.click(btn);
      expect(dispatch).toHaveBeenCalledWith({
        type: "viewOptionState/toggleAveragePlane",
        payload: true,
      });
    });

    it("quando cambio la visibilita` in 'disabilitato' del piano medio globale il componente richiami la action corretta per aggiornare lo stato", async () => {
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
          <Options />
        </Provider>,
      );
      await waitFor(() => screen.getByTestId("option-container"));
      fireEvent.click(screen.getByTestId("plane-active"));
      fireEvent.click(screen.getByTestId("plane-inactive"));
      expect(dispatch).toHaveBeenCalledWith({
        type: "viewOptionState/toggleAveragePlane",
        payload: false,
      });
    });
  });

  it("la Ui per resettare il filtraggio sia visibile al caricamento del dataset", async () => {
    render(
      <Provider store={mockStore(createMockRootState())}>
        <Options />
      </Provider>,
    );
    await waitFor(() => screen.getByTestId("option-container"));
    expect(screen.getByTestId("reset-filter")).toBeInTheDocument();
  });

  it("il bottone di reset deve eseguire un`azione di reset", async () => {
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
        <Options />
      </Provider>,
    );
    await waitFor(() => screen.getByTestId("option-container"));
    const btn = screen.getByTestId("reset-filter");
    fireEvent.click(btn);
    expect(dispatch).toHaveBeenCalledWith({ type: "data/reset" });
  });
});
