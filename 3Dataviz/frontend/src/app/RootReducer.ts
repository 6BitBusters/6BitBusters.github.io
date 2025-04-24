import { combineReducers } from "@reduxjs/toolkit";
import DataSlice from "../features/data/dataSlice";
import AppSlice from "../features/appStatus/appSlice";
import DataSourceSlice from "../features/dataSource/dataSourceSlice";
import ViewOptionSlice from "../features/viewOption/viewOptionSlice";
import RaycastHitSlice from "../features/raycast/raycastHitSlice";
import FilterOptionSlice from "../features/filterOption/filterOptionSlice";

const rootReducer = combineReducers({
  data: DataSlice,
  appState: AppSlice,
  dataSource: DataSourceSlice,
  raycast: RaycastHitSlice,
  viewOption: ViewOptionSlice,
  filterOption: FilterOptionSlice,
});

export default rootReducer;
