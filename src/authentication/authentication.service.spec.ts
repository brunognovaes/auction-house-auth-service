import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { AuthenticationRepositoryMock } from './authentication.repository.mock';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigModule } from '@nestjs/config';

const mockRegisteredUser = {
  email: 'bruno.gomes@gmail.com',
  password: '123456',
};

const mockNotRegisteredUser = {
  email: 'bruno.gomes@hotmail.com',
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

  it('should not authenticate a not registered user', async () => {
    const response = await service.authenticate(mockNotRegisteredUser);

    expect(response).toBeFalsy();
  });
});
