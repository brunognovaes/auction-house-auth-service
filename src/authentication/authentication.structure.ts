import { IError } from 'src/errors/error';

export interface IUser {
  id: number;
  email: string;
  password: string;
  active: boolean;
  role: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IAuthenticationRepository {
  findOneByEmail(email: string): Promise<IUser | null>;
  findOneById(id: number): Promise<IUser | null>;
  createOne(user: IUserLogin): Promise<IUser>;
}

export interface IVerifyReturn {
  authenticated: boolean;
  role: string;
}

export interface IAuthenticationService {
  authenticate(data: IUserLogin): Promise<string | IError>;
  verify(token: string): Promise<IVerifyReturn>;
  create(user: IUserLogin): Promise<true>;
}
