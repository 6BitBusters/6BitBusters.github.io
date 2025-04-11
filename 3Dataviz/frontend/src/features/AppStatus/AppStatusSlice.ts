import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "./types/AppState";
import { RootState } from "../../app/Store";
import { MaxRequestError } from "./Errors/MaxRequestError";
import { ServerError } from "./Errors/ServerError";
import { NetworkError } from "./Errors/NetworkError";

const initialState: AppState = {
  isLoading: false,
  error: null,
};

const appStatusSlice = createSlice({
  name: "appStatus",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (state.error != null) {
        state.error = null;
      }
    },
    setError: (state, action: PayloadAction<number>) => {
      state.isLoading = false;
      switch (action.payload) {
        case 429:
          state.error = new MaxRequestError();
          break;
        case 500:
          state.error = new ServerError();
          break;
        case 404:
        default:
          state.error = new NetworkError();
          break;
      }
    },
  },
});

export const { setLoading, setError } = appStatusSlice.actions;

export const selectorAppState = (state: RootState) => state.appState;

export default appStatusSlice.reducer;
