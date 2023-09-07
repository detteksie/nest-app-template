import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JWT_ACCESS_SECRET } from 'src/constants/env.constant';

@Global()
@Module({
  imports: [
    PassportModule.registerAsync({
      inject: [ConfigService],
      async useFactory() {
        return Promise.resolve({});
      },
    }),
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
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
