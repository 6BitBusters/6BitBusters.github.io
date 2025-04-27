import { CustomError } from "./customError";

export class ServerError extends CustomError {
  constructor() {
    super(500, "Errore di connessione al server");
    this.name = "Server Error";
  }
}
