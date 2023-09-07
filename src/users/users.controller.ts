import { Controller, Get, Param, UseGuards, Req, Query, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Request } from 'express';
import { User } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UsernameResDto } from './dto/username-res.dto';
import { UsersService } from './users.service';
import { PaginationQueryDto, checkPaginationDefault } from 'src/utils/pagination-query.helper';
import { UserPaginationRes } from './dto/user-pagination-res.dto';
import { getUrl } from 'src/utils/pagination.helper';
import { PaginationTypeEnum } from 'src/utils/torm-paginate';

@ApiTags('users')
@Controller({
  path: 'users',
  version: '1',
})
@UseInterceptors(CacheInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse({ type: () => UserPaginationRes })
  async getProductList(@Req() req: Request, @Query() productListQueryDto: PaginationQueryDto) {
    checkPaginationDefault(productListQueryDto);

    const url = getUrl(req);
    const result = await this.usersService.getUserList({
      page: productListQueryDto.page,
      limit: productListQueryDto.limit,
      route: url.pathname,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
    });
    return result;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: User })
  async getProfile(@Req() req: Request) {
    return req.user;
  }

  @Get('u/:username')
  @Serialize(UsernameResDto)
  @ApiResponse({ type: UsernameResDto })
  async getUserByUsername(@Param('username') username: string): Promise<User> {
    return this.usersService.getUserByUsername(username);
  }
}
