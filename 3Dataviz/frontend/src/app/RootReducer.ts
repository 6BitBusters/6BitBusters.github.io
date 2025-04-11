import { combineReducers } from "@reduxjs/toolkit";
import AppStatusSlice from "../features/AppStatus/AppStatusSlice";
import DataSourceSlice from "../features/DataSource/DataSourceSlice";

const rootReducer = combineReducers({
  appState: AppStatusSlice,
  dataSource: DataSourceSlice,
});

export default rootReducer;
