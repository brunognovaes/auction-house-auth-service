import { HttpStatus } from '@nestjs/common';
import { AppError } from 'src/errors/error';

export class AuthError extends AppError {
  name: string;
  code: number;
  message: string;

  constructor(code: number, message: string) {
    super('AuthError', code, message);
  }
}

export default {
  USER_NOT_FOUND: new AuthError(HttpStatus.NOT_FOUND, 'Invalid e-mail'),
  INVALID_CREDENTIALS: new AuthError(
    HttpStatus.UNAUTHORIZED,
    'Invalid password',
  ),
  USER_UNAUTHORIZED: new AuthError(
    HttpStatus.UNAUTHORIZED,
    'User unauthorized',
  ),
  USER_INACTIVE: new AuthError(HttpStatus.FORBIDDEN, 'User inactive'),
};
