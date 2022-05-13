export interface IError {
  internalCode: string;
  code: number;
  message: string;
}

export class AppError implements IError {
  internalCode: string;
  code: number;
  message: string;

  constructor(
    internalCode = 'internal.error',
    code = 500,
    message = 'Internal server error',
  ) {
    this.internalCode = internalCode;
    this.code = code;
    this.message = message;
  }
}
