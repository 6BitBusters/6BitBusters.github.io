export abstract class CustomError extends Error {
  private errNo: number;

  constructor(errNo: number, msg: string) {
    super(msg);
    this.errNo = errNo;
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  getErrNo(): number {
    return this.errNo;
  }
  getErrorMessage(): string {
    return this.message;
  }
}
