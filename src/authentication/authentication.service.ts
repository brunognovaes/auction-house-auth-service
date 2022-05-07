import { Inject, Injectable } from '@nestjs/common';
import {
  IAuthenticationRepository,
  IAuthenticationService,
  IError,
  IUserLogin,
} from './authentication.structure';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import errors from './authentication.errors';

@Injectable()
export class AuthenticationService implements IAuthenticationService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: IAuthenticationRepository,
  ) {}

  async authenticate(data: IUserLogin): Promise<string | IError> {
    const user = await this.usersRepository.findOneByEmail(data.email);

    if (!user) {
      return errors.userNotFound;
    }
    if (!user.active) {
      return errors.userInactive;
    }

    const result = await bcrypt.compare(data.password, user.password);

    if (!result) {
      return errors.invalidCredentials;
    }

    const token = jwt.sign(
      { user_id: user.id, role: user.role },
      process.env.SECRET,
    );

    return token;
  }
}
