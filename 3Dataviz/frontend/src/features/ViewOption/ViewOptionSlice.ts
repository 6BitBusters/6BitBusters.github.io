import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ViewOptionState } from "./types/ViewOptionState";
import { RootState } from "../../app/Store";

const initialState: ViewOptionState = {
  isPlaneActive: false,
};

const viewOptionSlice = createSlice({
  name: "viewOptionState",
  initialState,
  reducers: {
    toggleAveragePlane: (state, action: PayloadAction<boolean>) => {
      state.isPlaneActive = action.payload;
    },
  },
});

export const { toggleAveragePlane } = viewOptionSlice.actions;

export const selectorViewOptionState = (state: RootState) =>
  state.viewOption.isPlaneActive;

export default viewOptionSlice.reducer;
