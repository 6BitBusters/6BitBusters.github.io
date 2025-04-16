import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RaycastHitState } from "./types/RaycastHitState";
import { RootState } from "../../app/Store";

const initialState: RaycastHitState = {
  previousSelectedBarId: null,
  barTooltipPosition: null,
};

const raycastHitSlice = createSlice({
  name: "raycastHitSlice",
  initialState,
  reducers: {
    setHit: (state, action: PayloadAction<number>) => {
      state.previousSelectedBarId = action.payload;
    },
    setTooltipPosition: (state, action: PayloadAction<[number,number,number] | null>) => {
      state.barTooltipPosition = action.payload;
    },
  },
});

export const { setHit, setTooltipPosition } = raycastHitSlice.actions;

export const selectorRaycastHit = (state: RootState) => state.raycast;

export default raycastHitSlice.reducer;
