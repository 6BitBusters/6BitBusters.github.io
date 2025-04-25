import { CustomError } from "./customError";

export class ServerError extends CustomError {
  constructor() {
    super(503, "Errore di connessione al server");
    this.name = "ServerError";
  }
}
