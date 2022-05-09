import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Injectable,
  Post,
} from '@nestjs/common';
import { IError } from 'src/errors/error';
import { IAuthenticationService, IUserLogin } from './authentication.structure';

@Injectable()
@Controller('auth')
export class AuthenticationController {
  constructor(
    @Inject('USERS_SERVICE') private usersService: IAuthenticationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async authenticate(@Body() data: IUserLogin): Promise<string | IError> {
    const response = await this.usersService.authenticate(data);
  }
}
