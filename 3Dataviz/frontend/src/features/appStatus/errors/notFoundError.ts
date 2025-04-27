import { CustomError } from "./customError";

export class NotFoundError extends CustomError {
  constructor() {
    super(404, "Non trovato");
    this.name = "Not Found Error";
  }
}
