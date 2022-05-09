import { Inject, Injectable } from '@nestjs/common';
import {
  IAuthenticationRepository,
  IUser,
  IUserLogin,
} from './authentication.structure';

@Injectable()
export class AuthenticationRepositoryMock implements IAuthenticationRepository {
  constructor(@Inject('INITIAL_VALUES') private users: IUser[]) {}

  async findOneByEmail(email: string): Promise<IUser | null> {
    const result = this.users.find((user) => user.email === email);
    return result;
  }

  async findOneById(id: number): Promise<IUser | null> {
    const result = this.users.find((user) => user.id === id);
    return result;
  }

  async createOne(user: IUserLogin): Promise<IUser> {
    const newUser = {
      ...user,
      id: this.users.length + 1,
      active: true,
      role: 'user',
    };
    this.users.push(newUser);
    return newUser;
  }
}
