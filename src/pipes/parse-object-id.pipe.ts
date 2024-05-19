import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectId } from 'mongodb';

/**
 * Defines the pipe for MongoDB ObjectID validation and transformation
 */
@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, ObjectId> {
  /**
   * Validates and transforms a value to a MongoDB ObjectID
   *
   * @remarks
   * Throws a ArgumentException if the validation fails
   *
   * @param {string} value The value to validate and transform
   * @param {ArgumentMetadata} metadata
   * @returns {ObjectId} The MongoDB ObjectID
   */
  transform(value: string, metadata: ArgumentMetadata): ObjectId {
    try {
      const objecId: ObjectId = ObjectId.createFromHexString(value);
      return objecId;
    } catch (err) {
      throw new BadRequestException(err?.message);
    }
  }
}
