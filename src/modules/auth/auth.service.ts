import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BEARER } from '~/constants/config.constant';
import { JWT_REFRESH_SECRET } from '~/constants/env.constant';
import { User } from '~/entities/user.entity';
import { comparePassword } from '~/utils/bcrypt.util';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(body: RegisterDto): Promise<User> {
    const findEmailExist = this.usersRepository.findOne({
      where: { email: body.email.toLowerCase() },
    });
    const findUsernameExist = this.usersRepository.findOne({
      where: { username: body.username.toLowerCase() },
    });
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

    const userDto = this.usersRepository.create({
      email: body.email.toLowerCase(),
      username: body.username.toLowerCase(),
      name: body.name,
      password: body.password,
    });

    const newUser = this.usersRepository.save(userDto);
    return newUser;
  }

  async validateUser(body: LoginDto): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: [{ email: body.userSession }, { username: body.userSession }],
      // cache: true,
    });

    const isMatch = user && (await comparePassword(body.password, user.password));

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

    // const cacheKey = `user#${user.id}`;
    // const cachedUser = await this.cacheManager.get(cacheKey);
    // if (cachedUser) {
    //   await this.cacheManager.del(cacheKey);
    // }
    // await this.cacheManager.set(cacheKey, user, 60 * 60 * 1000);

    return {
      tokenType: BEARER,
      accessToken,
      refreshToken,
    };
  }
}
