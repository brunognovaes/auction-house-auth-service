import { Inject, Injectable } from '@nestjs/common';
import {
  IAuthenticationRepository,
  IAuthenticationService,
  IAuthenticationServiceArguments,
} from './authentication.structure';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthenticationService implements IAuthenticationService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: IAuthenticationRepository,
  ) {}

  async authenticate(data: IAuthenticationServiceArguments): Promise<string> {
    const user = await this.usersRepository.findOneByEmail(data.email);
    if (user?.active) {
      const result = await bcrypt.compare(data.password, user.password);
      if (result) {
        const token = jwt.sign(
          { user_id: user.id, role: user.role },
          process.env.SECRET,
        );
        return token;
      }
    }
    return null;
  }
}
