import { Inject, Injectable } from '@nestjs/common';
import {
  IAuthenticationRepository,
  IAuthenticationService,
  IUserLogin,
  IVerifyReturn,
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

  async authenticate(data: IUserLogin): Promise<string> {
    const user = await this.usersRepository.findOneByEmail(data.email);

    if (!user) {
      throw errors.USER_NOT_FOUND;
    }
    if (!user.active) {
      throw errors.USER_INACTIVE;
    }

    const result = await bcrypt.compare(data.password, user.password);

    if (!result) {
      throw errors.INVALID_CREDENTIALS;
    }

    const token = jwt.sign(
      { user_id: user.id, role: user.role },
      process.env.SECRET,
    );

    return token;
  }

  async verify(token: string): Promise<IVerifyReturn> {
    const response = jwt.verify(token, process.env.SECRET);
    const userId = response?.user_id;
    const user = await this.usersRepository.findOneById(userId);

    if (!user || !user.active) {
      throw errors.USER_UNAUTHORIZED;
    }

    return {
      authenticated: true,
      role: user.role,
    };
  }

  async create(user: IUserLogin): Promise<true> {
    await this.usersRepository.createOne(user);
    return true;
  }
}
