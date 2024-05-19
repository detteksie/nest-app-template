import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  TypeOrmDataSourceFactory,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import { DataSource, getConnectionOptions } from 'typeorm';
// import { jsonStringify } from '|/utils/json-stringify.util';

let dataSource: DataSource = null;

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory, OnModuleDestroy {
  private readonly logger = new Logger(TypeOrmConfig.name);

  constructor(private readonly configService: ConfigService) {}

  async createTypeOrmOptions(connectionName?: string): Promise<TypeOrmModuleOptions> {
    // this.logger.debug(jsonStringify(this.configService), 'configService');
    // this.logger.debug(connectionName, 'connectionName');
    const connectionOptions = await getConnectionOptions();
    // this.logger.debug(jsonStringify(connectionOptions), 'connectionOptions');
    const typeOrmModuleOptions: TypeOrmModuleOptions = {
      ...connectionOptions,
      autoLoadEntities: true,
    };
    return typeOrmModuleOptions;
  }

  async onModuleDestroy() {
    if (dataSource)
      if (dataSource.isInitialized) {
        try {
          await dataSource.destroy();
          this.logger.debug('TypeORM closed');
        } catch (err) {
          this.logger.error('Error clossing TypeORM', err);
        }
      } else {
        this.logger.debug('TypeORM already closed.');
      }
  }
}

export const dataSourceFactory: TypeOrmDataSourceFactory = async (options) => {
  dataSource = new DataSource(options);
  const d = await dataSource.initialize();
  return d;
};
