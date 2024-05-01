import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtConfig } from '~/config/jwt.config';
import { PassportConfig } from '~/config/passport.config';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule.registerAsync({ useClass: PassportConfig }),
    JwtModule.registerAsync({ useClass: JwtConfig }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
