import { combineReducers } from "@reduxjs/toolkit";
import DataSlice from "../features/Data/DataSlice";
import AppSlice from "../features/AppStatus/AppSlice";
import DataSourceSlice from "../features/DataSource/DataSourceSlice";
import ViewOptionSlice from "../features/ViewOption/ViewOptionSlice";
import RaycastHitSlice from "../features/Raycast/RaycastHitSlice";
import FilterOptionSlice from "../features/FilterOption/FilterOptionSlice";

const rootReducer = combineReducers({
  data: DataSlice,
  appState: AppSlice,
  dataSource: DataSourceSlice,
  raycast: RaycastHitSlice,
  viewOption: ViewOptionSlice,
  filterOption: FilterOptionSlice,
});

export default rootReducer;
