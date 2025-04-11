import { combineReducers } from "@reduxjs/toolkit";
import AppStatusSlice from "../features/AppStatus/AppStatusSlice";

const rootReducer = combineReducers({
  appState: AppStatusSlice,
});

export default rootReducer;
