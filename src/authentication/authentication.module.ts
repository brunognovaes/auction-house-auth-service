import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    {
      provide: 'USERS_SERVICE',
      useClass: AuthenticationService,
    },
  ],
})
export class AuthenticationModule {}
