import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DataSourceState } from "./types/DataSourceState";
import { fetchDatasets } from "./RequestHandler";
import { DatasetInfo } from "./types/DatasetInfo";

const initialState: DataSourceState = {
    datasets: [],
    currentDataset: null,
}

const dataSourceSlice = createSlice({
    name: "dataSource",
    initialState,
    reducers: {
        trySetCurrentDataset: (state, action: PayloadAction<number>) => {
            let dataset: DatasetInfo | undefined = state.datasets.find(dataset=>dataset.id==action.payload);
            dataSourceSlice.caseReducers.setCurrentDataset(state,{type: action.type, payload: dataset});
        },
        setCurrentDataset: (state, action: PayloadAction<DatasetInfo|undefined>) => {
            if (action.payload) {
                state.currentDataset = action.payload;
            }
        },
    }, 
    extraReducers : (builder) => {
        builder.addCase(requestDatasets.fulfilled,(state,action:PayloadAction<DatasetInfo[]>)=>{
            state.datasets = action.payload;
        })
    }
});

export const requestDatasets = createAsyncThunk(
    "dataSource/requestDatasets",
    async (_, {rejectWithValue }) => {
      try {
        const response = await fetchDatasets();
        return response;
      } catch (e: unknown) {
        return rejectWithValue(e);
      }
    },
);



export const {trySetCurrentDataset,setCurrentDataset} = dataSourceSlice.actions;

export const selectorDatasets = (state: DataSourceState) => state.datasets;
export const selectorCurrentDataset = (state: DataSourceState) => state.currentDataset;

export default dataSourceSlice.reducer;