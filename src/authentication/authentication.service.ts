import { Inject, Injectable } from '@nestjs/common';
import {
  IAuthenticationRepository,
  IAuthenticationService,
  IAuthenticationServiceArguments,
} from './authentication.structure';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

@Injectable()
export class AuthenticationService implements IAuthenticationService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: IAuthenticationRepository,
  ) {}

  async authenticate(data: IAuthenticationServiceArguments): Promise<string> {
    const user = await this.usersRepository.findOneByEmail(data.email);
    if (user && !user.active) {
      return null;
    }
    const result = await bcrypt.compare(data.password, user.password);
    if (result) {
      const token = jwt.sign(
        { user_id: user.id, role: user.role },
        process.env.SECRET,
      );
      return token;
    }
    return null;
  }
}
