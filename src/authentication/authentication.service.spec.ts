import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { AuthenticationRepositoryMock } from './authentication.repository.mock';

const mockUserLogin = {
  email: 'bruno.gomes@qesh.ai',
  password: '123456',
};

const mockUsersRepository = [
  {
    id: 1,
    email: 'bruno.gomes@qesh.ai',
    password: 'bcryptpassword',
  },
];

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: 'USERS_REPOSITORY',
          useValue: AuthenticationRepositoryMock,
        },
        {
          provide: 'INITIAL_VALUES',
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('it should compare if the incoming user is authenticated', () => {
    const response = service.authenticate(mockUserLogin);
  });
});
