import { CustomError } from "./CustomError";

export class NotFoundError extends CustomError {
  constructor() {
    super(404, "Non trovato");
    this.name = "NotFoundError";
  }
}
