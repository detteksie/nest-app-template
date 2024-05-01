import { ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: Express.Multer.File;
}

export class UploadImagesDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  images: Express.Multer.File[];
}

export class UploadMultipleFilesDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  avatar?: Express.Multer.File[];

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  backgrounds?: Express.Multer.File[];
}
