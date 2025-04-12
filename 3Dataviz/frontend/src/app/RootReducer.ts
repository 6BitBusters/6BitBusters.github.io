import { combineReducers } from "@reduxjs/toolkit";
import AppStatusSlice from "../features/AppStatus/AppStatusSlice";
import RaycastHitSlice from "../features/Raycast/RaycastHitSlice";

const rootReducer = combineReducers({
  appState: AppStatusSlice,
  raycast: RaycastHitSlice
});

export default rootReducer;
