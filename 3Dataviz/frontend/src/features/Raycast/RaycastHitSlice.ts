import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RaycastHit } from "./types/RaycastHit";
import { Vector3 } from "three";

const initialState: RaycastHit = {
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

export const selectorRaycastHit = (state: RaycastHit) => state;

export default raycastHitSlice.reducer;
