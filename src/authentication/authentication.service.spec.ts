import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { AuthenticationRepositoryMock } from './authentication.repository.mock';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigModule } from '@nestjs/config';
import errors from './authentication.errors';

const mockRegisteredUser = {
  email: 'bruno.gomes@gmail.com',
  password: '123456',
};

const mockNotRegisteredUser = {
  email: 'bruno.gomes@hotmail.com',
  password: '123456',
};

const mockInactiveUser = {
  email: 'bruno.gomes@yahoo.com.br',
  password: '123456',
};

const mockUsersRepository = [
  {
    id: 1,
    email: 'bruno.gomes@gmail.com',
    password: 'hash',
    active: true,
    role: 'user',
  },
  {
    id: 2,
    email: 'bruno.gomes@yahoo.com.br',
    password: 'hash',
    active: false,
    role: 'user',
  },
];

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        AuthenticationService,
        {
          provide: 'USERS_REPOSITORY',
          useClass: AuthenticationRepositoryMock,
        },
        {
          provide: 'INITIAL_VALUES',
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should authenticate a valid user', async () => {
    const token = 'validtoken';
    const bcryptSpy = jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(true));
    const jwtSpy = jest.spyOn(jwt, 'sign').mockImplementation(() => token);

    const response = await service.authenticate(mockRegisteredUser);

    expect(response).toBeDefined();
    expect(response).toBe(token);
    expect(bcryptSpy).toHaveBeenCalledTimes(1);
    expect(jwtSpy).toHaveBeenCalledTimes(1);
  });

  it('should not authenticate a non registered user', async () => {
    const response = await service.authenticate(mockNotRegisteredUser);

    expect(response).toBe(errors.userNotFound);
  });

  it('should not authenticate an user when passed invalid credentials', async () => {
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(false));

    const response = await service.authenticate(mockRegisteredUser);

    expect(response).toBeDefined();
    expect(response).toBe(errors.invalidCredentials);
  });

  it('should not authenticate an user when is inactive', async () => {
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(true));

    const response = await service.authenticate(mockInactiveUser);

    expect(response).toBeDefined();
    expect(response).toBe(errors.userInactive);
  });

  it('should return a token with correct properties', async () => {
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(true));

    const response = await service.authenticate(mockRegisteredUser);
    const { user_id, role } = jwt.verify(response, process.env.SECRET);

    expect(user_id).toBeDefined();
    expect(role).toBeDefined();
    expect(user_id).toBe(mockUsersRepository[0].id);
    expect(role).toBe(mockUsersRepository[0].role);
  });

  it('should return authenticated when passed a valid jwt', async () => {
    const token = jwt.sign({ user_id: 1, role: 'user' }, process.env.SECRET);
    const responseMock = { authenticated: true, role: 'user' };
    const response = await service.verify(token);

    expect(response).toBeDefined();
    expect(response).toEqual(responseMock);
  });

  it('should not return authenticated when passed a valid jwt', async () => {
    const token = jwt.sign('invalid token', process.env.SECRET);
    const responseMock = { authenticated: false, role: null };
    const response = await service.verify(token);

    expect(response).toBeDefined();
    expect(response).toEqual(responseMock);
  });

  it('should create an user', async () => {
    const newUser = {
      email: 'new.bruno.gomes@gmail.com',
      password: '123456',
    };
    const response = await service.create(newUser);

    expect(response).toBeDefined();
    expect(response).toBe(true);
  });
});
