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

  it('should return a http error when passed unregistered user', async () => {
    const serviceSpy = jest
      .spyOn(service, 'authenticate')
      .mockRejectedValue(authErrors.USER_NOT_FOUND);

    expect(controller.authenticate(mockNotRegisteredUser)).rejects.toThrowError(
      HttpException,
    );
    expect(
      controller.authenticate(mockNotRegisteredUser),
    ).rejects.toHaveProperty('message', authErrors.USER_NOT_FOUND.message);
    expect(serviceSpy).toHaveBeenCalledTimes(2);
  });
});
