import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { LocalStrategy } from 'src/strategies/local.strategy';
import { BCryptHelper } from 'src/utils/hash.helper';
import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: process.env.NODE_ENV === 'production' ? '30d' : '1h' },
        };
      },
    }),
  ],
  providers: [AuthService, BCryptHelper, LocalStrategy, JwtStrategy],
  exports: [AuthService, BCryptHelper, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
