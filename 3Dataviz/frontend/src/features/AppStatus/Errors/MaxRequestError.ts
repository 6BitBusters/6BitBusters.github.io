export class MaxRequestError extends Error {
  constructor() {
    super("Numero massimo di richieste API effettuate");
    this.name = "MaxRequestError";
    Object.setPrototypeOf(this, MaxRequestError.prototype);
  }
}
