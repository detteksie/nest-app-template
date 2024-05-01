import { CacheOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet';
import {
  CACHE_TTL,
  REDIS_HOST,
  // REDIS_PASSWORD,
  // REDIS_PORT,
} from '~/constants/env.constant';
// import { jsonStringify } from '~/utils/json-stringify.util';

@Injectable()
export class CacheManagerConfig implements CacheOptionsFactory {
  private readonly logger = new Logger(CacheManagerConfig.name);

  constructor(private readonly configService: ConfigService) {}

  async createCacheOptions(): Promise<CacheOptions> {
    // this.logger.debug(jsonStringify(this.configService), 'configService');
    const store = await redisStore({
      host: this.configService.get<string>(REDIS_HOST),
      // port: this.configService.get<number>(REDIS_PORT),
      // password: this.configService.get<string>(REDIS_PASSWORD),
    });
    const cacheOptions: CacheOptions<Record<string, any>> = {
      store: (args) => {
        // this.logger.debug(jsonStringify(args), 'store(args)');
        return store;
      },
      ttl: this.configService.get<number>(CACHE_TTL),
    };
    return cacheOptions;
  }
}
