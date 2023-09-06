import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy, RefreshTokenStrategy } from 'src/strategies/jwt.strategy';
import { LocalStrategy } from 'src/strategies/local.strategy';
import { BCryptHelper } from 'src/utils/hash.helper';
import { AuthService } from './auth.service';
import { JWT_ACCESS_SECRET } from 'src/constants/env.constant';

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        // default config
        return {
          secret: configService.get<string>(JWT_ACCESS_SECRET),
          signOptions: { expiresIn: process.env.NODE_ENV === 'production' ? '1h' : '15m' },
        };
      },
    }),
  ],
  providers: [AuthService, BCryptHelper, LocalStrategy, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthService, BCryptHelper, LocalStrategy, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
