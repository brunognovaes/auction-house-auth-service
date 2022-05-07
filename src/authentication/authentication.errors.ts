import { HttpStatus } from '@nestjs/common';

export default {
  userNotFound: {
    code: HttpStatus.NOT_FOUND,
    message: 'Invalid e-mail',
  },
  invalidCredentials: {
    code: HttpStatus.UNAUTHORIZED,
    message: 'Invalid password',
  },
  userInactive: {
    code: HttpStatus.FORBIDDEN,
    message: 'User inactive',
  },
};
