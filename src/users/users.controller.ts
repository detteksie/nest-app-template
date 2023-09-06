import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { User } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UsernameResDto } from './dto/username-res.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
