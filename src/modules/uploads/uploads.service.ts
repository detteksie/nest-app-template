import { readFile, unlink } from 'fs/promises';
import path from 'path';

import { Injectable, Logger } from '@nestjs/common';

import { jsonStringify } from '|/utils/json-stringify.util';

// import { S3Service } from '|/utils/s3-service.helper';
import { UploadMultipleFilesDto } from './dto/upload.dto';

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);

  // constructor(private readonly s3Service: S3Service) {}

  async uploadSingle(image: Express.Multer.File) {
    const { buffer: _, ...img } = image;
    return img;
  }

  async uploadSingleDisk(image: Express.Multer.File) {
    let filepath: string;
    let result: Buffer;
    try {
      if (image.destination) {
        filepath = path.resolve(image.path);
        const file = await readFile(filepath);
        result = file;
      }
      return result;
    } finally {
      // catch (err) {
      //   throw err;
      // }
      if (result instanceof Buffer) {
        const sto = setTimeout(
          async () => {
            this.logger.debug(jsonStringify(filepath), 'filepath');
            await unlink(filepath);
            clearTimeout(sto);
          },
          process.env.NODE_ENV !== 'production' ? 5000 : 1000,
        );
      }
    }
  }

  async uploadMultiple(images: Express.Multer.File[]) {
    const imgs = images.map(({ buffer: _, ...img }) => img);
    return imgs;
  }

  async uploadMultipleDisk(images: Express.Multer.File[]) {
    const filepaths: string[] = [];
    const result = this.uploadMultiple(images);
    try {
      images.forEach((image) => {
        if (image.destination) {
          filepaths.push(path.resolve(image.path));
        }
      });
      return result;
    } finally {
      // catch (err) {
      //   throw err;
      // }
      const unlinks: Promise<void>[] = [];
      const sto = setTimeout(
        async () => {
          this.logger.debug(jsonStringify(filepaths), 'filepaths');
          filepaths.forEach((filepath) => {
            unlinks.push(unlink(filepath));
          });
          await Promise.all(unlinks);
          clearTimeout(sto);
        },
        process.env.NODE_ENV !== 'production' ? 5000 : 1000,
      );
    }
  }

  async uploadMultipleFiles(files: UploadMultipleFilesDto) {
    const result: { [K in keyof UploadMultipleFilesDto]: Omit<Express.Multer.File, 'buffer'>[] } =
      {};
    (Object.keys(files) as (keyof UploadMultipleFilesDto)[]).forEach((key) => {
      result[key] = files[key].map(({ buffer, ...file }) => file);
    });
    return result;
  }

  async uploadMultipleFilesDisk(files: UploadMultipleFilesDto) {
    const objFilepaths: Record<keyof UploadMultipleFilesDto, string[]> = {
      avatar: [],
      backgrounds: [],
    };
    const result: { [K in keyof UploadMultipleFilesDto]: Omit<Express.Multer.File, 'buffer'>[] } =
      {};
    try {
      (Object.keys(files) as (keyof UploadMultipleFilesDto)[]).forEach((key) => {
        result[key] = files[key].map(({ buffer, ...file }) => {
          if (file.destination) objFilepaths[key].push(path.resolve(file.path));
          return file;
        });
      });
      return result;
    } finally {
      // catch (err) {
      //   throw err;
      // }
      const unlinks: Promise<void>[] = [];
      const sto = setTimeout(
        async () => {
          this.logger.debug(jsonStringify(objFilepaths), 'objFilepaths');
          (Object.keys(objFilepaths) as (keyof UploadMultipleFilesDto)[]).forEach((key) => {
            objFilepaths[key].forEach((filepath) => {
              unlinks.push(unlink(filepath));
            });
          });
          await Promise.all(unlinks);
          clearTimeout(sto);
        },
        process.env.NODE_ENV !== 'production' ? 5000 : 1000,
      );
    }
  }

  // async uploadS3(image: Express.Multer.File) {
  //   const { id, response } = await this.s3Service.s3Upload(image);
  //   return {
  //     uploadId: id,
  //     imageUrl: response.Location,
  //   };
  // }
}
