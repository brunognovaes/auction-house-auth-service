import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import authErrors from './authentication.errors';
import { AuthenticationRepositoryMock } from './authentication.repository.mock';
import { HttpException } from '@nestjs/common';

const mockValidLoginBody = {
  email: 'bruno.gomes@gmail.com',
  password: '123456',
};

const mockNotRegisteredUser = {
  email: 'bruno.gomes@mock.com',
  password: '123456',
};

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: 'USERS_REPOSITORY',
          useClass: AuthenticationRepositoryMock,
        },
        {
          provide: 'INITIAL_VALUES',
          useValue: [],
        },
      ],
      controllers: [AuthenticationController],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should return a jwt when passed a valid body', async () => {
    const token = 'token';
    const serviceSpy = jest
      .spyOn(service, 'authenticate')
      .mockReturnValue(Promise.resolve(token));

    const response = await controller.authenticate(mockValidLoginBody);

    expect(response).toBeDefined();
    expect(response).toBe(token);
    expect(serviceSpy).toHaveBeenCalledWith(mockValidLoginBody);
    expect(serviceSpy).toHaveBeenCalledTimes(1);
  });

  it('should return a http error when passed invalid body', async () => {
    const serviceSpy = jest
      .spyOn(service, 'authenticate')
      .mockRejectedValue(authErrors.USER_NOT_FOUND);

    expect(controller.authenticate(mockNotRegisteredUser)).rejects.toThrowError(
      HttpException,
    );
    expect(serviceSpy).toHaveBeenCalledTimes(1);
  });

  it('should return a authenticate body when user is authorized', async () => {
    const authorizedBody = {
      authenticated: true,
      role: 'user',
    };
    const serviceSpy = jest
      .spyOn(service, 'verify')
      .mockResolvedValue(authorizedBody);
    const token = 'token';
    const response = await controller.verify({ token });

    expect(response).toBeDefined();
    expect(response).toBe(authorizedBody);
    expect(serviceSpy).toHaveBeenCalledTimes(1);
  });

  it('should return a http error when passed invalid jwt', async () => {
    const serviceSpy = jest
      .spyOn(service, 'verify')
      .mockRejectedValue(authErrors.USER_UNAUTHORIZED);
    const token = 'token';

    expect(controller.verify({ token })).rejects.toThrowError(HttpException);
    expect(serviceSpy).toHaveBeenCalledTimes(1);
  });

  it('should create a user', async () => {
    const serviceSpy = jest.spyOn(service, 'create').mockResolvedValue(true);

    expect(controller.create(mockValidLoginBody)).resolves.toBe(true);
    expect(serviceSpy).toHaveBeenCalledTimes(1);
  });
});
