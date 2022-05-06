import { IAuthenticationRepository, IUser } from './authentication.structure';

export class AuthenticationRepositoryMock implements IAuthenticationRepository {
  private users: IUser[] = [];

  async findOneByEmail(email: string): Promise<IUser | null> {
    const result = this.users.find((user) => user.email === email);
    return result;
  }
}
