import { createSlice } from "@reduxjs/toolkit";
import { RaycastHit } from "./types/RaycastHit";
import { SubtractEquation } from "three";

const initialState: RaycastHit = {
    previousSelectedBarId: null,
    barTooltipPosition: null
}

const raycastHitSlice = createSlice({
    name: "raycastHitSlice",
    initialState,
    reducers: {
        
    }
});

export const {} = raycastHitSlice.actions;

export const selectorRaycastHit = (state: RaycastHit ) => state;

export default raycastHitSlice.reducer;