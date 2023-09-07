import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({ type: Number, default: 1 })
  @IsNumberString()
  @IsOptional()
  page?: number | string = '1';

  @ApiProperty({ type: Number, default: 10 })
  @IsNumberString()
  @IsOptional()
  limit?: number | string = '10';
}

export const checkPaginationDefault = (
  paginationQueryDto: PaginationQueryDto,
  d: {
    page?: number;
    minPage?: number;
    limit?: number;
    minLimit?: number;
  } = {
    page: 1,
    minPage: 0,
    limit: 10,
    minLimit: 5,
  },
) => {
  if (!paginationQueryDto.page || (paginationQueryDto.page as number) < d.minPage)
    paginationQueryDto.page = d.page;
  if (!paginationQueryDto.limit || (paginationQueryDto.limit as number) < d.minLimit)
    paginationQueryDto.limit = d.limit;
};
