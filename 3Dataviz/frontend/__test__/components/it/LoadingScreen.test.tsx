import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "../../../src/App";
import React from "react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import { AppDispatch, RootState } from "../../../src/app/Store";
import { CreateMockRootState } from "../../utils/StateMockCreator";

const middlewares = [thunk];
const mockStore = configureMockStore<RootState, AppDispatch>(middlewares);
describe("CurrentDatasetLabel", () => {
  it("quando il dataset sta caricando il testo di caricamento deve essere presente", async () => {
    render(
      <Provider
        store={mockStore(
          CreateMockRootState({
            appState: {
              isLoading: true,
              error: null,
            },
          }),
        )}>
        <App />
      </Provider>,
    );
    await waitFor(() => screen.getByTestId("loading"));
    const label = screen.getByText("caricamento del dataset...");
    expect(label).toBeInTheDocument();
  });
  it("quando il dataset e` stato caricato il testo di caricamento il testo non deve essere presente", async () => {
    render(
      <Provider
        store={mockStore(
          CreateMockRootState({
            appState: {
              isLoading: false,
              error: null,
            },
          }),
        )}>
        <App />
      </Provider>,
    );
    await waitFor(() => {
      expect(screen.queryByText("caricamento del dataset...")).toBeNull();
      expect(screen.getByTestId("canvas")).toBeInTheDocument();
    });
  });
});
