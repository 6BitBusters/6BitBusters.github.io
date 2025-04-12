import { combineReducers } from "@reduxjs/toolkit";
import dataSlice from "../features/Data/DataSlice";
import AppStatusSlice from "../features/AppStatus/AppStatusSlice";

const rootReducer = combineReducers({
  data: dataSlice,
  appState: AppStatusSlice,
});

export default rootReducer;
