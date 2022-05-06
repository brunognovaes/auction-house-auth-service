export interface IUser {
  id: number;
  email: string;
  password: string;
}

export interface IAuthenticationRepository {
  findOneByEmail(email: string): Promise<IUser | null>;
}
