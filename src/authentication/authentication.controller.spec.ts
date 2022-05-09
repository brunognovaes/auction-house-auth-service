import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

const mockValidLoginBody = {
  email: 'bruno.gomes@gmail.com',
  password: '123456',
};

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthenticationService],
      controllers: [AuthenticationController],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should return a jwt when passed a valid body', () => {
    const token = 'token';
    const serviceSpy = jest
      .spyOn(service, 'authenticate')
      .mockReturnValue(Promise.resolve(token));

    const response = controller.authenticate(mockValidLoginBody);

    expect(response).toBeDefined();
    expect(serviceSpy).toHaveBeenCalledWith(mockValidLoginBody);
    expect(serviceSpy).toHaveBeenCalledTimes(1);
  });
});
