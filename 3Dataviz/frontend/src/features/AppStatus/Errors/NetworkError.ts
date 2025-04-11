export class NetworkError extends Error {
  constructor() {
    super("Errore di connessione, riprova più tardi");
    this.name = "NetworkError";
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}
