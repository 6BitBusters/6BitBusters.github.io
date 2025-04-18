import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FilterOptionState } from "./types/FilterOption";
import { RootState } from "../../app/Store";

const initialState: FilterOptionState = {
  isGreater: false,
};

export const filterOptionSlice = createSlice({
  name: "filterOptionSlice",
  initialState,
  reducers: {
    toggleIsGreater: (state, action: PayloadAction<boolean>) => {
      state.isGreater = action.payload;
    },
  },
});

export const selectorIsGreater = (state: RootState) =>
  state.filterOption.isGreater;

export const { toggleIsGreater } = filterOptionSlice.actions;
export default filterOptionSlice.reducer;
