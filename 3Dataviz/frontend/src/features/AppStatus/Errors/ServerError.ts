export class ServerError extends Error {
  constructor() {
    super("Errore di connessione al server");
    this.name = "ServerError";
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}
