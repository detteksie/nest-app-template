import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { MONGODB_URI } from '~/constants/env.constant';
// import { jsonStringify } from '~/utils/json-stringify.util';

@Injectable()
export class MongooseConfig implements MongooseOptionsFactory {
  private readonly logger = new Logger(MongooseConfig.name);

  constructor(private readonly configService: ConfigService) {}

  async createMongooseOptions(): Promise<MongooseModuleOptions> {
    // this.logger.debug(jsonStringify(this.configService), 'configService');
    if (process.env.NODE_ENV === 'development') mongoose.set('debug', true);
    const mongooseModuleOptions: MongooseModuleOptions = {
      uri: this.configService.get<string>(MONGODB_URI),
      connectionFactory: (connection: mongoose.Connection) => {
        connection.on('connected', () => {
          this.logger.debug(`MongoDB connected ${connection.host}`);
        });
        connection.on('disconnected', () => {
          this.logger.debug('MongoDB disconnected');
        });
        connection.on('close', () => {
          this.logger.debug('MongoDB close');
        });
        connection.on('error', (err) => {
          this.logger.debug('MongoDB connection failed! for error: ');
          this.logger.error(err);
        });
        return connection;
      },
    };
    return mongooseModuleOptions;
  }
}
