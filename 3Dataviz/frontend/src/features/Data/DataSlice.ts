import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DataState } from "./types/DataState";
import { RootState } from "../../app/Store";
import { FilterPayload } from "./types/FilterPayload";
import { Data } from "./interfaces/Data";
import { fetchDataset } from "./RequestHandler";

const initialState: DataState = {
  data: [],
  legend: null,
  average: 0,
  z: [],
  x: [],
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    filterTopN: (state, action: PayloadAction<FilterPayload>) => {
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
        }
      });
    },
    filterAboveValue: (state, action: PayloadAction<FilterPayload>) => {
      if (action.payload.isGreater) {
        state.data.forEach((data) => {
          if (data.y < action.payload.value) {
            data.show = false;
          }
        });
      }
      if (!action.payload.isGreater) {
        state.data.forEach((data) => {
          if (data.y > action.payload.value) {
            data.show = false;
          }
        });
      }
    },
    filterAverage: (state, action: PayloadAction<boolean>) => {
      dataSlice.caseReducers.filterAboveValue(state, {
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
    // .addCase(requestData.rejected, (state, action) => {
    //   //AppState error
    // });
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

export const { filterTopN, filterAboveValue, filterAverage, reset } =
  dataSlice.actions;

export const selectorData = (state: DataState) => state;

export default dataSlice.reducer;
