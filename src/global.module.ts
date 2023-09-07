import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-ioredis-yet';
import { DataSource, getConnectionOptions } from 'typeorm';
import {
  CACHE_TTL,
  JWT_ACCESS_SECRET,
  THROTTLE_LIMIT,
  THROTTLE_TTL,
} from './constants/env.constant';
import { User } from './entities/user.entity';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { BCryptHelper } from './utils/hash.helper';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test'
          ? `.env.${process.env.NODE_ENV}`
          : '.env',
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>(THROTTLE_TTL) || 60,
            limit: config.get<number>(THROTTLE_LIMIT) || 10,
          },
        ],
      }),
    }),
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        const ttl = config.get<number>(CACHE_TTL) || 10000;
        return {
          store: () => redisStore({ host: 'localhost', port: 6379, ttl }),
          ttl,
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async () => {
        const connectionOptions = await getConnectionOptions();
        // console.log('connectionOptions', connectionOptions);
        return {
          ...connectionOptions,
          autoLoadEntities: true,
        };
      },
      dataSourceFactory: async (options) => {
        const d = await new DataSource(options).initialize();
        return d;
      },
    }),
    TypeOrmModule.forFeature([User]),
    // PassportModule,
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
  providers: [BCryptHelper, LocalStrategy, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [
    // Modules
    ConfigModule,
    ThrottlerModule,
    CacheModule,
    TypeOrmModule,
    /* PassportModule, */
    JwtModule,
    // Others
    BCryptHelper,
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class GlobalModule {}
