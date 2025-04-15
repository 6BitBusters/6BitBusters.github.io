import { CustomError } from "../Errors/CustomError";

export type AppState = {
  isLoading: boolean;
  error: CustomError | null;
};
