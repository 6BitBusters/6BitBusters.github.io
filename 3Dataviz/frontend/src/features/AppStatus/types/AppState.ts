import { SerializedError } from "@reduxjs/toolkit";
import { CustomError } from "../Errors/CustomError";

export type AppState = {
  isLoading: boolean;
  error: SerializedError | null;
};
