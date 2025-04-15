import { combineReducers } from "@reduxjs/toolkit";
import dataSlice from "../features/Data/DataSlice";
import AppStatusSlice from "../features/AppStatus/AppStatusSlice";
import DataSourceSlice from "../features/DataSource/DataSourceSlice";
import RaycastHitSlice from "../features/Raycast/RaycastHitSlice";

const rootReducer = combineReducers({
  data: dataSlice,
  appState: AppStatusSlice,
  dataSource: DataSourceSlice,
  raycast: RaycastHitSlice,
});

export default rootReducer;
