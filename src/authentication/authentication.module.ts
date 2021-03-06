import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationRepositoryMock } from './authentication.repository.mock';
import { AuthenticationService } from './authentication.service';

@Module({
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    {
      provide: 'INITIAL_VALUES',
      useValue: [],
    },
    {
      provide: 'USERS_REPOSITORY',
      useClass: AuthenticationRepositoryMock,
    },
  ],
})
export class AuthenticationModule {}
