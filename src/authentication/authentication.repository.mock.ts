import { Inject, Injectable } from '@nestjs/common';
import { IAuthenticationRepository, IUser } from './authentication.structure';

@Injectable()
export class AuthenticationRepositoryMock implements IAuthenticationRepository {
  constructor(@Inject('INITIAL_VALUES') private users: IUser[]) {}

  async findOneByEmail(email: string): Promise<IUser | null> {
    const result = this.users.find((user) => user.email === email);
    return result;
  }
}
