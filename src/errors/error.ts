export interface IError {
  internalCode: string;
  code: number;
  message: string;
}

export class AppError implements IError {
  internalCode: string;
  code: number;
  message: string;

  constructor(internalCode: string, code: number, message: string) {
    this.internalCode = internalCode;
    this.code = code;
    this.message = message;
  }
}
