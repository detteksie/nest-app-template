import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModuleOptions, ThrottlerOptionsFactory } from '@nestjs/throttler';
import { THROTTLE_LIMIT, THROTTLE_TTL } from '~/constants/env.constant';
// import { jsonStringify } from '~/utils/json-stringify.util';

@Injectable()
export class ThrottlerConfig implements ThrottlerOptionsFactory {
  private readonly logger = new Logger(ThrottlerConfig.name);

  constructor(private readonly configService: ConfigService) {}

  async createThrottlerOptions(): Promise<ThrottlerModuleOptions> {
    // this.logger.debug(jsonStringify(this.configService), 'configService');
    const throttlerModuleOptions: ThrottlerModuleOptions = {
      throttlers: [
        {
          ttl: this.configService.get<number>(THROTTLE_TTL) || 60,
          limit: this.configService.get<number>(THROTTLE_LIMIT) || 10,
        },
      ],
    };
    return throttlerModuleOptions;
  }
}
