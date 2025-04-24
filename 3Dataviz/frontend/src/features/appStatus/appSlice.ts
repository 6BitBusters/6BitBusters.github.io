import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "./types/appState";
import { TooManyRequestsError } from "./errors/tooManyRequestsError";
import { ServerError } from "./errors/serverError";
import { NotFoundError } from "./errors/notFoundError";
import { requestData } from "../data/dataSlice";
import {
  requestDatasets,
  setCurrentDataset,
} from "../dataSource/dataSourceSlice";
import { DatasetInfo } from "../dataSource/types/datasetInfo";
import { CustomError } from "./errors/customError";
import { RootState } from "../../app/store";
import { serializeError } from "./utils/errorSerializer";

const initialState: AppState = {
  isLoading: false,
  error: null,
};

const appSlice = createSlice({
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
          state.error = serializeError(generateError(action.payload as number));
          state.error = serializeError(generateError(action.payload as number));
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
          state.error = serializeError(generateError(action.payload as number));
          state.error = serializeError(generateError(action.payload as number));
        },
      )
      // se l`utente seleziona un dataset non presente in lista
      .addCase(
        setCurrentDataset,
        (state, action: PayloadAction<DatasetInfo | undefined>) => {
          if (action.payload === undefined) {
            state.error = serializeError(generateError(404));
            state.error = serializeError(generateError(404));
          }
        },
      );
  },
});

function generateError(errNo: number): CustomError {
  switch (errNo) {
    case 429:
      return new TooManyRequestsError();
    case 500:
      return new ServerError();
    case 404:
    default:
      return new NotFoundError();
  }
}

export const selectorAppState = (state: RootState) => state.appState;

export default appSlice.reducer;
