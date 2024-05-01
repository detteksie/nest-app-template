import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptionsFactory } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { MULTER_DEST } from '~/constants/env.constant';

@Injectable()
export class MulterConfig implements MulterOptionsFactory {
  private readonly logger = new Logger(MulterConfig.name);

  constructor(private readonly configService: ConfigService) {}

  async createMulterOptions(): Promise<MulterOptions> {
    const multerOptions: MulterOptions = {
      dest: this.configService.get<string>(MULTER_DEST),
    };
    return multerOptions;
  }
}
