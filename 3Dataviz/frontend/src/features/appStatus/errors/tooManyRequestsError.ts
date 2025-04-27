import { CustomError } from "./customError";

export class TooManyRequestsError extends CustomError {
  constructor() {
    super(429, "Numero massimo di richieste API effettuate");
    this.name = "Too Many Requests Error";
  }
}
