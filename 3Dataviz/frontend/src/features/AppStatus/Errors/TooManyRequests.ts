import { CustomError } from "./CustomError";

export class TooManyRequests extends CustomError {
  constructor() {
    super(429, "Numero massimo di richieste API effettuate");
    this.name = "TooManyRequests";
  }
}
