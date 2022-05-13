import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  Post,
  UseFilters,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { IError } from 'src/errors/error';
import { AuthenticationService } from './authentication.service';
import { IVerifyReturn } from './authentication.structure';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { ResponseInterceptor } from 'src/interceptors/response.interceptor';
import { TokenDto, UserDto } from './authentication.dto';

@Injectable()
@Controller('auth')
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(new ResponseInterceptor())
export class AuthenticationController {
  constructor(private usersService: AuthenticationService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async authenticate(@Body() data: UserDto): Promise<string | IError> {
    try {
      const response = await this.usersService.authenticate(data);
      return response;
    } catch (error) {
      throw new HttpException(error, error.code);
    }
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify(@Body() data: TokenDto): Promise<IVerifyReturn | IError> {
    try {
      const response = await this.usersService.verify(data.token);
      return response;
    } catch (error: any) {
      throw new HttpException(error, error.code);
    }
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: UserDto): Promise<true> {
    try {
      await this.usersService.create(data);
      return true;
    } catch (error: any) {
      throw new HttpException(error, error.code);
    }
  }
}
