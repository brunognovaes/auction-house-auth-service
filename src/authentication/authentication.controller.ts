import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  Post,
} from '@nestjs/common';
import { IError } from 'src/errors/error';
import { AuthenticationService } from './authentication.service';
import { IUserLogin, IVerifyReturn } from './authentication.structure';

@Injectable()
@Controller('auth')
export class AuthenticationController {
  constructor(private usersService: AuthenticationService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async authenticate(@Body() data: IUserLogin): Promise<string | IError> {
    try {
      const response = await this.usersService.authenticate(data);
      return response;
    } catch (error: any) {
      throw new HttpException(error.message, error.code);
    }
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify(@Body() token: string): Promise<IVerifyReturn | IError> {
    try {
      const response = await this.usersService.verify(token);
      return response;
    } catch (error: any) {
      throw new HttpException(error.message, error.code);
    }
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: IUserLogin): Promise<true> {
    try {
      await this.usersService.create(data);
      return true;
    } catch (error: any) {
      throw new HttpException(error, error.code);
    }
  }
}
