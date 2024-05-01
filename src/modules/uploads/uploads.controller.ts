import {
  BadRequestException,
  Controller,
  Put,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { UploadImageDto, UploadImagesDto, UploadMultipleFilesDto } from './dto/upload.dto';
import { UploadsService } from './uploads.service';

const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  console.log(req.url);
  console.log('fileFilter', file);
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return callback(new BadRequestException('Only image files are allowed'), false);
  }
  callback(null, true);
};

const diskStorageVar = diskStorage({
  destination: (req, file, cb) => {
    console.log('destination', file);
    cb(null, './upload');
  },
  filename: (req, file, cb) => {
    console.log('filename', file);
    cb(null, `${Date.now()}__${file.originalname}`);
  },
});

const singleImage = (storage?: any) =>
  FileInterceptor('image', {
    limits: {
      fileSize: 1024 * 1024 * 2,
    },
    fileFilter: imageFileFilter,
    storage,
  });

const multipleImage = (storage?: any) =>
  FilesInterceptor('images', 8, {
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter: imageFileFilter,
    storage,
  });

const multipleFiles = (storage?: any) =>
  FileFieldsInterceptor(
    [
      {
        name: 'avatar',
        maxCount: 1,
      },
      {
        name: 'backgrounds',
        maxCount: 2,
      },
    ],
    {
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
      fileFilter: imageFileFilter,
      storage,
    },
  );

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}

  @Put('single')
  @UseInterceptors(singleImage())
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Single Image', type: UploadImageDto })
  async uploadSingle(@UploadedFile() image: Express.Multer.File) {
    console.time('uploadSingle');
    const result = await this.uploadsService.uploadSingle(image);
    console.timeEnd('uploadSingle');
    return result;
  }

  @Put('single/disk')
  @UseInterceptors(singleImage(diskStorageVar))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Single Image', type: UploadImageDto })
  async uploadSingleDisk(@UploadedFile() image: Express.Multer.File, @Res() res: Response) {
    console.time('uploadSingleDisk');
    const result = await this.uploadsService.uploadSingleDisk(image);
    // res.setHeader('Content-Type', image.mimetype);
    res.setHeader('Content-Type', 'image/*');
    console.timeEnd('uploadSingleDisk');
    res.send(result);
    return;
  }

  @Put('multiple')
  @UseInterceptors(multipleImage())
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Multiple Image', type: UploadImagesDto })
  async uploadMultiple(@UploadedFiles() images: Express.Multer.File[]) {
    console.time('uploadMultiple');
    const result = await this.uploadsService.uploadMultiple(images);
    console.timeEnd('uploadMultiple');
    return result;
  }

  @Put('multiple/disk')
  @UseInterceptors(multipleImage(diskStorageVar))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Multiple Image', type: UploadImagesDto })
  async uploadMultipleDisk(@UploadedFiles() images: Express.Multer.File[], @Res() res: Response) {
    console.time('uploadMultipleDisk');
    const result = await this.uploadsService.uploadMultipleDisk(images);
    console.timeEnd('uploadMultipleDisk');
    res.send(result);
    return;
  }

  @Put('multiple-files')
  @UseInterceptors(multipleFiles())
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Multiple Files', type: UploadMultipleFilesDto })
  async uploadMultipleFiles(
    @UploadedFiles()
    files: UploadMultipleFilesDto,
  ) {
    console.time('uploadMultipleFiles');
    const result = await this.uploadsService.uploadMultipleFiles(files);
    console.timeEnd('uploadMultipleFiles');
    return result;
  }

  @Put('multiple-files/disk')
  @UseInterceptors(multipleFiles(diskStorageVar))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Multiple Files', type: UploadMultipleFilesDto })
  async uploadMultipleFilesDisk(
    @UploadedFiles()
    files: UploadMultipleFilesDto,
  ) {
    console.time('uploadMultipleFiles');
    const result = await this.uploadsService.uploadMultipleFilesDisk(files);
    console.timeEnd('uploadMultipleFiles');
    return result;
  }

  // @Post('s3')
  // @UseInterceptors(
  //   FileInterceptor('image', {
  //     limits: {
  //       fileSize: 1024 * 1024 * 2,
  //     },
  //     fileFilter: imageFileFilter,
  //     storage: diskStorageVar,
  //   }),
  // )
  // async uploadImage(@UploadedFile() image: Express.Multer.File) {
  //   if (!image) throw new BadRequestException('no image found');
  //   return await this.uploadsService.uploadS3(image);
  // }
}
