import { SerializedError } from "@reduxjs/toolkit";

export type AppState = {
  isLoading: boolean;
  error: SerializedError | null;
};
