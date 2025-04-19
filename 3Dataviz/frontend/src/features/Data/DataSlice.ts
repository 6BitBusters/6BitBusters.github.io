import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DataState } from "./types/DataState";
import { FilterPayload } from "./types/FilterPayload";
import { Data } from "./interfaces/Data";
import { fetchDataset } from "./RequestHandler";
import { RootState } from "../../app/Store";

const initialState: DataState = {
  data: [
    { id: 0, show: true, x: 1, y: 54, z: 1 },
    { id: 1, show: true, x: 1, y: 24, z: 2 },
    { id: 2, show: true, x: 2, y: 32, z: 4 },
    { id: 3, show: true, x: 3, y: 14, z: 1 },
    { id: 4, show: true, x: 2, y: 21, z: 3 },
    { id: 5, show: true, x: 6, y: 43, z: 3 },
  ],
  legend: { x: "Citta", z: "Ora", y: "Temperatura" },
  average: 5,
  x: [
    "Madrid",
    "Parigi",
    "Milano",
    "Guanabo",
    "Londra",
    "Venezia",
    "Roma",
    "Tokyo",
  ],
  z: ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"],
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    filterFirstN: (state, action: PayloadAction<FilterPayload>) => {
      // array dei dati da filtrare
      let sortedData: number[];
      if (action.payload.isGreater) {
        sortedData = [...state.data]
          .sort((a, b) => b.y - a.y)
          .slice(0, action.payload.value)
          .map((data) => data.id);
      } else {
        sortedData = [...state.data]
          .sort((a, b) => a.y - b.y)
          .slice(0, action.payload.value)
          .map((data) => data.id);
      }

      state.data.forEach((data) => {
        // rendo invisibili i dati che non sono stati presi nella precedente operazione
        if (!sortedData.includes(data.id)) {
          data.show = false;
        } else {
          data.show = true;
        }
      });
    },
    filterByValue: (state, action: PayloadAction<FilterPayload>) => {
      if (action.payload.isGreater) {
        state.data.forEach((data) => {
          if (data.y < action.payload.value) {
            data.show = false;
          } else {
            data.show = true;
          }
          if (data.y >= action.payload.value) {
            data.show = true;
          }
        });
      }
      if (!action.payload.isGreater) {
        state.data.forEach((data) => {
          if (data.y > action.payload.value) {
            data.show = false;
          } else {
            data.show = true;
          }
        });
      }
    },
    filterByAverage: (state, action: PayloadAction<boolean>) => {
      dataSlice.caseReducers.filterByValue(state, {
        payload: { value: state.average, isGreater: action.payload },
        type: action.type,
      });
    },
    reset: (state) => {
      state.data.forEach((data) => (data.show = true));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(requestData.fulfilled, (state, action) => {
      const data: Data[] = action.payload.data.map((data) => ({
        id: data.id,
        show: true,
        y: data.y,
        x: data.x,
        z: data.z,
      }));

      state.data = data;
      state.average =
        state.data.reduce((a, b) => a + b.y, 0) / state.data.length;
      state.legend = action.payload.legend;
      state.x = action.payload.xLabels;
      state.z = action.payload.zLabels;
    });
  },
});

export const requestData = createAsyncThunk(
  "data/requestData",
  async (datasetId: number, { rejectWithValue }) => {
    try {
      const response = await fetchDataset(datasetId);
      return response;
    } catch (e: unknown) {
      return rejectWithValue(e);
    }
  },
);

export const { filterFirstN, filterByValue, filterByAverage, reset } =
  dataSlice.actions;

export const selectorData = (state: RootState) => state.data;

export default dataSlice.reducer;
