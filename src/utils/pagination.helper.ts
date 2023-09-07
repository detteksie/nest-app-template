import { ApiProperty } from '@nestjs/swagger';
import { Request } from 'express';

export const getUrl = (req: Request) => new URL(`${req.protocol}://${req.headers.host}${req.url}`);

export class PaginationMeta {
  @ApiProperty({ default: 98 })
  totalItems: number;

  @ApiProperty({ default: 10 })
  itemCount: number;

  @ApiProperty({ default: 10 })
  itemsPerPage: number;

  @ApiProperty({ default: 10 })
  totalPages: number;

  @ApiProperty({ default: 7 })
  currentPage: number;
}

export const getPaginationMeta = (
  totalItems: number,
  itemCount: number,
  itemsPerPage: number,
  totalPages: number,
  currentPage: number,
): PaginationMeta => {
  return { totalItems, itemCount, itemsPerPage, totalPages, currentPage };
};

export class PaginationLinks {
  // @ApiProperty({ default: '/list?page=8&limit=10' })
  // self: string;

  @ApiProperty({ default: '/list?limit=10' })
  first: string;

  @ApiProperty({ default: '/list?page=7&limit=10' })
  previous: string;

  @ApiProperty({ default: '/list?page=9&limit=10' })
  next: string;

  @ApiProperty({ default: '/list?page=10&limit=10' })
  last: string;
}

export const getPaginationLinks = (
  paginationUrl: string,
  page: number,
  lastPage: number,
): PaginationLinks => {
  return {
    // self: paginationUrl,
    first: paginationUrl.replace(`page=${page}`, `page=1`),
    previous: page <= 1 ? null : paginationUrl.replace(`page=${page}`, `page=${page - 1}`),
    next: page >= lastPage ? null : paginationUrl.replace(`page=${page}`, `page=${page + 1}`),
    last: paginationUrl.replace(`page=${page}`, `page=${lastPage}`),
  };
};
