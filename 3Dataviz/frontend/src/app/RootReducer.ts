import { combineReducers } from "@reduxjs/toolkit";
import DataSlice from "../features/Data/DataSlice";
import AppSlice from "../features/AppStatus/AppSlice";
import DataSourceSlice from "../features/DataSource/DataSourceSlice";
import RaycastHitSlice from "../features/Raycast/RaycastHitSlice";

const rootReducer = combineReducers({
  data: DataSlice,
  appState: AppSlice,
  dataSource: DataSourceSlice,
  raycast: RaycastHitSlice,
});

export default rootReducer;
