export interface IUser {
  id: number;
  email: string;
  password: string;
  active: boolean;
  role: string;
}

export interface IAuthenticationServiceArguments {
  email: string;
  password: string;
}

export interface IAuthenticationRepository {
  findOneByEmail(email: string): Promise<IUser | null>;
}

export interface IAuthenticationService {
  authenticate(data: IAuthenticationServiceArguments): Promise<string>;
}
