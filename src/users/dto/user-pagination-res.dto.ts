import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';
import { PaginationLinks, PaginationMeta } from 'src/utils/pagination.helper';

export class UserPaginationRes {
  @ApiProperty({ type: () => PaginationLinks })
  links: PaginationLinks;

  @ApiProperty({ type: () => PaginationMeta })
  meta: PaginationMeta;

  @ApiProperty({ type: () => [User] })
  result: User[];
}
