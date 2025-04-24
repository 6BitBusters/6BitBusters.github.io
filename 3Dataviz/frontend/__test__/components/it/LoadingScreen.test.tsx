import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import EnvironmentPage from "../../../src/pages/environmentPage/environmentPage";
import React from "react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import { AppDispatch, RootState } from "../../../src/app/store";
import { createMockRootState } from "../../utils/stateMockCreator";

const middlewares = [thunk];
const mockStore = configureMockStore<RootState, AppDispatch>(middlewares);
describe("CurrentDatasetLabel", () => {
  it("quando il dataset sta caricando il testo di caricamento deve essere presente", async () => {
    render(
      <Provider
        store={mockStore(
          createMockRootState({
            appState: {
              isLoading: true,
              error: null,
            },
          }),
        )}>
        <EnvironmentPage />
      </Provider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("loader")).toBeInTheDocument()
    });
  });
  it("quando il dataset e` stato caricato il testo di caricamento il testo non deve essere presente", async () => {
    render(
      <Provider
        store={mockStore(
          createMockRootState({
            appState: {
              isLoading: false,
              error: null,
            },
          }),
        )}>
        <EnvironmentPage />
      </Provider>,
    );
    await waitFor(() => {
      expect(screen.queryByTestId("loader")).toBeNull();
      expect(screen.getByTestId("canvas")).toBeInTheDocument();
    });
  });
});
