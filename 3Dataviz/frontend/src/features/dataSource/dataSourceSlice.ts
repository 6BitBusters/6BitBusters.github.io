import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DataSourceState } from "./types/dataSourceState";
import { fetchDatasets } from "./requestHandler";
import { DatasetInfo } from "./types/datasetInfo";
import { RootState } from "../../app/store";

const initialState: DataSourceState = {
  datasets: [
    {
      id: 1,
      name: "API A",
      size: [1000, 2000],
      description: "Dati del meteo della città di Roma a Marzo 2025",
    },
  ],
  currentDataset: null,
};

const dataSourceSlice = createSlice({
  name: "dataSource",
  initialState,
  reducers: {
    // cerca se esiste il dataset e chiama setCurrentDataset
    trySetCurrentDataset: (state, action: PayloadAction<number>) => {
      const dataset: DatasetInfo | undefined = state.datasets.find(
        (dataset) => dataset.id == action.payload,
      );
      dataSourceSlice.caseReducers.setCurrentDataset(state, {
        type: action.type,
        payload: dataset,
      });
    },
    // se il dataset non e` undefined e quindi e` stato trovato precedentemente aggiorna il currentDataset
    setCurrentDataset: (
      state,
      action: PayloadAction<DatasetInfo | undefined>,
    ) => {
      if (action.payload) {
        state.currentDataset = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      requestDatasets.fulfilled,
      (state, action: PayloadAction<DatasetInfo[]>) => {
        state.datasets = action.payload;
      },
    );
  },
});

export const requestDatasets = createAsyncThunk(
  "dataSource/requestDatasets",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchDatasets();
      return response;
    } catch (e: unknown) {
      return rejectWithValue(e);
    }
  },
);

export const { trySetCurrentDataset, setCurrentDataset } =
  dataSourceSlice.actions;

export const selectorDatasets = (state: RootState) => state.dataSource.datasets;
export const selectorCurrentDataset = (state: RootState) =>
  state.dataSource.currentDataset;

export default dataSourceSlice.reducer;
