import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { AuthenticationRepositoryMock } from './authentication.repository.mock';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigModule } from '@nestjs/config';

const mockUserLogin = {
  email: 'bruno.gomes@qesh.ai',
  password: '123456',
};

const mockUsersRepository = [
  {
    id: 1,
    email: 'bruno.gomes@qesh.ai',
    password: 'bcryptpassword',
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

  it('it should compare if the incoming user is authenticated', async () => {
    const token = 'validtoken';
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(true));
    jest.spyOn(jwt, 'sign').mockImplementation(() => token);

    const response = await service.authenticate(mockUserLogin);

    expect(response).toBeDefined();
    expect(response).toBe(token);
  });
});
