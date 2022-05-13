import { HttpStatus } from '@nestjs/common';
import { AppError } from 'src/errors/error';

export class AuthError extends AppError {
  internalCode: string;
  code: number;
  message: string;

  constructor(internalCode: string, code: number, message: string) {
    super(internalCode, code, message);
  }
}

export default {
  USER_NOT_FOUND: new AuthError(
    'auth.user.notfound',
    HttpStatus.NOT_FOUND,
    'Invalid e-mail',
  ),
  INVALID_CREDENTIALS: new AuthError(
    'auth.user.invalidcredentials',
    HttpStatus.UNAUTHORIZED,
    'Invalid password',
  ),
  USER_UNAUTHORIZED: new AuthError(
    'auth.user.unauthorized',
    HttpStatus.UNAUTHORIZED,
    'User unauthorized',
  ),
  USER_INACTIVE: new AuthError(
    'auth.user.inactive',
    HttpStatus.FORBIDDEN,
    'User inactive',
  ),
};
