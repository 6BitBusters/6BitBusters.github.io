import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FilterOptionState } from "./types/FilterOption";

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

export const selectorIsGreater = (state: FilterOptionState) => state.isGreater;

export const { toggleIsGreater } = filterOptionSlice.actions;
export default filterOptionSlice.reducer;
