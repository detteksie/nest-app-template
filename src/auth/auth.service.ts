import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { JWT_REFRESH_SECRET } from 'src/constants/env.constant';
import { User } from 'src/entities/user.entity';
import { BCryptHelper } from 'src/utils/hash.helper';
import { EntityManager } from 'typeorm';
import { LoginReqDto } from './dto/login-req.dto';
import { RegisterReqDto } from './dto/register-req.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly bCryptHelper: BCryptHelper,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterReqDto): Promise<User> {
    const userQuery = this.entityManager.createQueryBuilder(User, 'user');

    const findEmailExist = userQuery
      .where('email = :email', { email: registerDto.email.toLowerCase() })
      .getOne();
    const findUsernameExist = userQuery
      .where('username = :username', { username: registerDto.username.toLowerCase() })
      .getOne();
    const [isEmailExist, isUsernameExist] = await Promise.all([findEmailExist, findUsernameExist]);

    const existUserFields: string[] = [];
    if (isEmailExist) existUserFields.push('Email');
    if (isUsernameExist) existUserFields.push('Username');
    if (existUserFields.length > 0)
      throw new ConflictException(
        `${existUserFields.join(' and ')} ${
          existUserFields.length > 1 ? 'are' : 'is'
        } already exist`,
      );

    const userDto = this.entityManager.create(User, {
      email: registerDto.email.toLowerCase(),
      username: registerDto.username.toLowerCase(),
      name: registerDto.name,
      password: registerDto.password,
    });

    const newUser = this.entityManager.save(User, userDto);
    return newUser;
  }

  async validateUser(loginDto: LoginReqDto): Promise<any> {
    const userQuery = this.entityManager.createQueryBuilder(User, 'user');

    const user = await userQuery
      .where('email = :email', { email: loginDto.userSession })
      .orWhere('username = :username', { username: loginDto.userSession })
      .getOne();

    const isMatch =
      user && (await this.bCryptHelper.comparePassword(loginDto.password, user.password));

    if (!isMatch) {
      return null;
    }
    return user;
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      signature: user.signature,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(JWT_REFRESH_SECRET),
      expiresIn: process.env.NODE_ENV === 'production' ? '30d' : '1d',
    });

    const cacheKey = `user#${user.id}`;
    const cachedUser = await this.cacheManager.get(cacheKey);
    if (cachedUser) {
      await this.cacheManager.del(cacheKey);
    }
    await this.cacheManager.set(cacheKey, user, 60 * 60 * 1000);

    return {
      accessToken,
      refreshToken,
    };
  }
}
