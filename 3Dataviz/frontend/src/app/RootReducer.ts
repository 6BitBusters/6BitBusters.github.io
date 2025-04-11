import { combineReducers } from "@reduxjs/toolkit";
import dataSlice from "../features/Data/DataSlice";

const rootReducer = combineReducers({
  data: dataSlice,
});

export default rootReducer;
