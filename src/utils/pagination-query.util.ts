import { ArgumentMetadata, ConsoleLogger, Injectable, PipeTransform } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PaginationQuery {
  @ApiProperty({ type: Number, default: 1 })
  @ApiPropertyOptional()
  @IsOptional()
  page?: number;

  @ApiProperty({ type: Number, default: 10 })
  @ApiPropertyOptional()
  @IsOptional()
  limit?: number;
}

type DefaultQuery = {
  page?: number;
  minPage?: number;
  limit?: number;
  minLimit?: number;
};
const defaultQuery: DefaultQuery = {
  page: 1,
  minPage: 0,
  limit: 10,
  minLimit: 5,
};

export const checkPaginationDefault = (query: PaginationQuery, value: DefaultQuery) => {
  if (!query.page || query.page < value.minPage) query.page = value.page;
  if (!query.limit || query.limit < value.minLimit) query.limit = value.limit;
};

@Injectable()
export class PaginationQueryPipe implements PipeTransform<PaginationQuery, PaginationQuery> {
  private readonly logger = new ConsoleLogger(PaginationQueryPipe.name);

  constructor(private readonly value: DefaultQuery = defaultQuery) {}

  transform(value: PaginationQuery, metadata: ArgumentMetadata): PaginationQuery {
    checkPaginationDefault(value, this.value);
    return value;
  }
}
