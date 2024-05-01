// import { Injectable } from '@nestjs/common';
// import { S3 } from 'aws-sdk';
// import { readFile, unlink } from 'fs/promises';
// import { nanoid } from 'nanoid';
// import path, { extname } from 'path';
// import { v4 } from 'uuid';

export const getS3ImageUrl = (
  filepath: string,
  filename: string,
  basepath = 'img',
  compressed = false,
) =>
  `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${basepath}/${filepath}/${filename}${
    compressed ? '.webp' : ''
  }`;

export const getS3ProductImages = (filepath: string, filename: string) => ({
  original: getS3ImageUrl(filepath, filename),
  // '50': getS3ImageUrl(filepath, filename, 'timg/50-square', true),
  '100': getS3ImageUrl(filepath, filename, 'timg/100-square', true),
  // '200': getS3ImageUrl(filepath, filename, 'timg/200-square', true),
  '300': getS3ImageUrl(filepath, filename, 'timg/300-square', true),
  '500': getS3ImageUrl(filepath, filename, 'timg/500-square', true),
});

// @Injectable()
// export class S3Service {
//   private s3 = new S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     signatureVersion: 'v4',
//   });
//   private bucket = process.env.AWS_S3_BUCKET;

//   async s3Upload(file: Express.Multer.File) {
//     console.time('s3Upload');
//     let ext = extname(file.originalname);
//     if (ext.toLowerCase() === '.jpeg') ext = '.jpg';
//     const id = v4();
//     const nanoId = nanoid(32);

//     const filepath = `product/${id}`;
//     const filename = `${nanoId}${ext.toLowerCase()}`;
//     const key = `img/${filepath}/${filename}`;

//     let body: Buffer = null;
//     if (file.destination) {
//       body = await readFile(path.resolve(file.path));
//     }

//     const params: S3.Types.PutObjectRequest = {
//       Bucket: this.bucket,
//       Key: key,
//       ACL: 'public-read',
//       Body: body ? body : file.buffer,
//       ContentType: file.mimetype,
//       Metadata: {
//         fieldname: file.fieldname,
//         originalname: file.originalname,
//       },
//     };

//     try {
//       const s3Response = await this.s3.upload(params).promise();

//       return {
//         id,
//         filepath,
//         filename,
//         response: s3Response,
//       };
//     } catch (err) {
//       console.error(err);
//       throw err;
//     } finally {
//       if (body) {
//         console.log('unlink', path.resolve(file.path));
//         unlink(path.resolve(file.path));
//       }
//       console.timeEnd('s3Upload');
//     }
//   }
// }
