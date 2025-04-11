import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./RootReducer";

export const store = configureStore({
  reducer: rootReducer,
});

type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  // Provvisorio
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
