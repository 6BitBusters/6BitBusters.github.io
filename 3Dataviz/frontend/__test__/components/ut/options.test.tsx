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
  it("Verifica che, al click sul bottone apposito, le opzioni si aprano e diventino visibili.", async () => {
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

  it("Verifica che, al click sul bottone apposito, la tabella si chiuda e diventi invisibile.", async () => {
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
    it("Verifica che l'interfaccia utente per il filtraggio rispetto al valore medio globale sia visibile al caricamento del dataset.", async () => {
      render(
        <Provider store={mockStore(createMockRootState())}>
          <Options />
        </Provider>,
      );
      await waitFor(() => screen.getByTestId("option-container"));
      expect(screen.getAllByTestId("average-filter")[0]).toBeInTheDocument();
    });

    it("Verifica che, al click sul bottone apposito, venga eseguito il filtraggio dei dati visualizzati per mostrare solo i valori inferiori al valore medio globale del dataset.", async () => {
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
    it("Verifica che, al click sul bottone apposito, venga eseguito il filtraggio dei dati visualizzati per mostrare solo i valori superiori al valore medio globale del dataset.", async () => {
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
    it("Verifica che l'interfaccia utente per il filtraggio dei top e bottom N valori sia visibile al caricamento del dataset.", async () => {
      render(
        <Provider store={mockStore(createMockRootState())}>
          <Options />
        </Provider>,
      );
      await waitFor(() => screen.getByTestId("option-container"));
      expect(screen.getAllByTestId("N-filter")[0]).toBeInTheDocument();
    });
    it("Verifica che, al click sul bottone apposito, venga eseguito il filtraggio dei dati visualizzati per mostrare solo gli N valori più bassi del dataset.", async () => {
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
    it("Verifica che, al click sul bottone apposito, venga eseguito il filtraggio dei dati visualizzati per mostrare solo i primi N valori più alti del dataset.", async () => {
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
    it("Verifica che, se il valore inserito per N non è un numero o è inferiore a zero, il click sul bottone di filtraggio top/bottom esegua un filtraggio per N=0", async () => {
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
    it("Verifica che l'interfaccia utente per modificare le opzioni di filtraggio sia visibile al caricamento del dataset.", async () => {
      render(
        <Provider store={mockStore(createMockRootState())}>
          <Options />
        </Provider>,
      );
      await waitFor(() => screen.getByTestId("option-container"));
      expect(screen.getByTestId("filter-options")).toBeInTheDocument();
    });
    it("Verifica che, quando l'algoritmo di filtraggio viene cambiato in 'superiore', il componente aggiorni il suo stato con la relativa action.", async () => {
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
    it("Verifica che, quando l'algoritmo di filtraggio viene cambiato in 'inferiori', il componente aggiorni il suo stato con la relativa action.", async () => {
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
    it("Verifica che l'interfaccia utente per modificare le opzioni di visualizzazione del piano medio sia visibile al caricamento del dataset.", async () => {
      render(
        <Provider store={mockStore(createMockRootState())}>
          <Options />
        </Provider>,
      );
      await waitFor(() => screen.getByTestId("option-container"));
      expect(screen.getByTestId("plane-view")).toBeInTheDocument();
    });

    it("Verifica che, quando la visibilità del piano medio globale viene impostata su 'abilitato', il componente richiami l'action corretta per aggiornare lo stato.", async () => {
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

    it("Verifica che, quando la visibilità del piano medio globale viene impostata su 'disabilitato', il componente richiami l'action corretta per aggiornare lo stato.", async () => {
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

  it("Verifica che l'interfaccia utente per resettare il filtraggio sia visibile al caricamento del dataset.", async () => {
    render(
      <Provider store={mockStore(createMockRootState())}>
        <Options />
      </Provider>,
    );
    await waitFor(() => screen.getByTestId("option-container"));
    expect(screen.getByTestId("reset-filter")).toBeInTheDocument();
  });

  it("Verifica che, al click sul bottone di reset, venga eseguita l'azione di reset del filtraggio.", async () => {
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
