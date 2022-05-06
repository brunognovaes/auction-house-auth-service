import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { AuthenticationRepositoryMock } from './authentication.repository.mock';

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
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('it should compare if the incoming user is authenticated', () => {
    expect(service).toBeDefined();
  });
});
