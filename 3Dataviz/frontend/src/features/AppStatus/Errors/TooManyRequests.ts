export class TooManyRequests extends Error {
  constructor() {
    super("Numero massimo di richieste API effettuate");
    this.name = "TooManyRequests";
    Object.setPrototypeOf(this, TooManyRequests.prototype);
  }
}
