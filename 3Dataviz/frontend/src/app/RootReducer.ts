import { combineReducers } from "@reduxjs/toolkit";
import dataSlice from "../features/Data/DataSlice";
import AppStatusSlice from "../features/AppStatus/AppStatusSlice";
import DataSourceSlice from "../features/DataSource/DataSourceSlice";
import ViewOptionSlice from "../features/ViewOption/ViewOptionSlice";
import RaycastHitSlice from "../features/Raycast/RaycastHitSlice";

const rootReducer = combineReducers({
  data: dataSlice,
  appState: AppStatusSlice,
  dataSource: DataSourceSlice,
  raycast: RaycastHitSlice,
  viewOption: ViewOptionSlice,
});

export default rootReducer;
