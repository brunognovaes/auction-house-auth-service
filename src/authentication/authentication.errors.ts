import { HttpStatus } from '@nestjs/common';
import { IError } from './authentication.structure';

export default {
  userNotFound: {
    code: HttpStatus.NOT_FOUND,
    message: 'Invalid e-mail',
  } as IError,
  invalidCredentials: {
    code: HttpStatus.UNAUTHORIZED,
    message: 'Invalid password',
  } as IError,
  userInactive: {
    code: HttpStatus.FORBIDDEN,
    message: 'User inactive',
  } as IError,
};
