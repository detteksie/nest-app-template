import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { BCryptHelper } from 'src/utils/hash.helper';
import { Repository } from 'typeorm';
import { LoginReqDto } from './dto/login.req-dto';
import { RegisterReqDto } from './dto/register.req-dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly bCryptHelper: BCryptHelper,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterReqDto): Promise<User> {
    const findEmailExist = this.usersRepository.findOne({
      where: { email: registerDto.email.toLowerCase() },
    });
    const findUsernameExist = this.usersRepository.findOne({
      where: { username: registerDto.username.toLowerCase() },
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
      email: registerDto.email.toLowerCase(),
      username: registerDto.username.toLowerCase(),
      name: registerDto.name,
      password: registerDto.password,
    });

    const newUser = this.usersRepository.save(userDto);
    return newUser;
  }

  async validateUser(loginDto: LoginReqDto): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: [{ email: loginDto.userSession }, { username: loginDto.userSession }],
    });

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
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
