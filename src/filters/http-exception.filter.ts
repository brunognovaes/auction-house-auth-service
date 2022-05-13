import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { IError } from '../errors/error';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const code = exception.getStatus();
    const { internalCode, message } = exception.getResponse() as IError;
    response.status(code).json({
      error: {
        message,
        code: internalCode,
        status: true,
      },
      data: {},
    });
  }
}
