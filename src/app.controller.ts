import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LoginReqDto } from './auth/dto/login-req.dto';
import { LoginResDto } from './auth/dto/login-res.dto';
import { ProfileResDto } from './auth/dto/profile-res.dto';
import { RegisterReqDto } from './auth/dto/register-req.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard, RefreshAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Serialize } from './interceptors/serialize.interceptor';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService, private readonly authService: AuthService) {}

  @Get('hello')
  @ApiResponse({ type: String })
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('register')
  @ApiResponse({ type: User })
  async register(@Body() registerReqDto: RegisterReqDto) {
    return this.authService.register(registerReqDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(AuthGuard('local'))
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginReqDto })
  @ApiResponse({ type: LoginResDto })
  async login(@Req() req: Request) {
    this.logger.debug(JSON.stringify(req.user, null, 2), 'req.user');
    return this.authService.login(req.user);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: LoginResDto })
  async refreshToken(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  // @UseInterceptors(new SerializeInterceptor(ProfileResponse))
  @Serialize(ProfileResDto)
  // @UseGuards(AuthGuard('jwt'))
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: User })
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
