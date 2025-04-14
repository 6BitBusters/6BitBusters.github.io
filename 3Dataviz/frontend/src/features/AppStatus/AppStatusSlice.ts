import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "./types/AppState";
import { TooManyRequests } from "./Errors/TooManyRequests";
import { ServerError } from "./Errors/ServerError";
import { NetworkError } from "./Errors/NetworkError";
import { requestData } from "../Data/DataSlice";
import {
  requestDatasets,
  setCurrentDataset,
} from "../DataSource/DataSourceSlice";
import { DatasetInfo } from "../DataSource/types/DatasetInfo";

const initialState: AppState = {
  isLoading: false,
  error: null,
};

const appStatusSlice = createSlice({
  name: "appStatus",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // mentre reperisco i dati del dataset
    builder
      .addCase(requestData.pending, (state) => {
        state.isLoading = true;
        if (state.error != null) {
          state.error = null;
        }
      })
      // se il reperimento dei dati va a buon fine
      .addCase(requestData.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(
        requestData.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.isLoading = false;
          // sara` sicuramente un numero in quanto ritorno sempre un response.status
          state.error = generateError(action.payload as number);
        },
      )
      // se mentre sto reperendo i dataset resetto lo stato degli errori
      .addCase(requestDatasets.pending, (state) => {
        if (state.error != null) {
          state.error = null;
        }
      })
      // se il reperimento dei dataset non va a buon fine
      .addCase(
        requestDatasets.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.error = generateError(action.payload as number);
        },
      )
      // se l`utente seleziona un dataset non presente in lista
      .addCase(
        setCurrentDataset,
        (state, action: PayloadAction<DatasetInfo | undefined>) => {
          if (action.payload === undefined) {
            state.error = generateError(404);
          }
        },
      );
  },
});

function generateError(errNo: number): Error {
  switch (errNo) {
    case 429:
      return new TooManyRequests();
    case 500:
      return new ServerError();
    case 404:
    default:
      return new NetworkError();
  }
}

export const selectorAppState = (state: AppState) => state;

export default appStatusSlice.reducer;
