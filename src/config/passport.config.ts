import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthOptionsFactory, IAuthModuleOptions } from '@nestjs/passport';
// import { jsonStringify } from '~/utils/json-stringify.util';

@Injectable()
export class PassportConfig implements AuthOptionsFactory {
  private readonly logger = new Logger(PassportConfig.name);

  constructor(private readonly configService: ConfigService) {}

  async createAuthOptions(): Promise<IAuthModuleOptions<any>> {
    // this.logger.debug(jsonStringify(this.configService), 'configService');
    const iAuthModuleOptions: IAuthModuleOptions<any> = {};
    return iAuthModuleOptions;
  }
}
