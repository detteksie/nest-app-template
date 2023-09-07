import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-ioredis-yet';
import { DataSource, getConnectionOptions } from 'typeorm';
import {
  CACHE_TTL,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
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
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test'
          ? `.env.${process.env.NODE_ENV}`
          : '.env',
      cache: process.env.NODE_ENV === 'production',
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      async useFactory(configService: ConfigService) {
        return {
          throttlers: [
            {
              ttl: configService.get<number>(THROTTLE_TTL) || 60,
              limit: configService.get<number>(THROTTLE_LIMIT) || 10,
            },
          ],
        };
      },
    }),
    CacheModule.registerAsync({
      inject: [ConfigService],
      async useFactory(configService: ConfigService) {
        return {
          store(args) {
            console.log('CacheModule->store_args', args);
            return redisStore({
              host: configService.get<string>(REDIS_HOST),
              port: configService.get<number>(REDIS_PORT),
              password: configService.get<string>(REDIS_PASSWORD),
              ttl: args.ttl,
            });
          },
          ttl: configService.get<number>(CACHE_TTL),
        };
      },
      isGlobal: true,
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
  ],
  providers: [BCryptHelper, LocalStrategy, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [
    // Modules
    TypeOrmModule,
    // Others
    BCryptHelper,
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class CoreModule {}
