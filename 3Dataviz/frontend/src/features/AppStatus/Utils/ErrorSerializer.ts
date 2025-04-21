import { SerializedError } from "@reduxjs/toolkit";
import { CustomError } from "../Errors/CustomError";

export function serializeError(error: CustomError) : SerializedError {
  return {
    name: error.name,
    message: error.message,
    code: error.getErrNo().toString(),
  };
}