import { combineReducers } from "@reduxjs/toolkit";
import dataSlice from "../features/Data/DataSlice";
import AppStatusSlice from "../features/AppStatus/AppStatusSlice";
import DataSourceSlice from "../features/DataSource/DataSourceSlice";
import ViewOptionSlice from "../features/ViewOption/ViewOptionSlice";

const rootReducer = combineReducers({
  data: dataSlice,
  appState: AppStatusSlice,
  dataSource: DataSourceSlice,
  viewOption: ViewOptionSlice,
});

export default rootReducer;
