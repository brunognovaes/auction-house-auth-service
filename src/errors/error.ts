export interface IError {
  code: number;
  message: string;
}

export class AppError implements IError {
  name: string;
  code: number;
  message: string;

  constructor(name: string, code: number, message: string) {
    this.name = name;
    this.code = code;
    this.message = message;
  }
}
