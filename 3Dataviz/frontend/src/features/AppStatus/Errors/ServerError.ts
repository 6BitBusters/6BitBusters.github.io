import { CustomError } from "./CustomError";

export class ServerError extends CustomError {
  constructor() {
    super(500, "Errore di connessione al server");
    this.name = "ServerError";
  }
}
