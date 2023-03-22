import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

interface Payload {
  sub: number;
  username: string;
  email: string;
  signature: string;
  iat: Date;
  exp: Date;
}

const extractJwt = (configService: ConfigService) => {
  return {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    secretOrKey: configService.get<string>('JWT_SECRET'),
  };
};

const validate = async (payload: Payload, usersRepository: Repository<User>) => {
  const user = await usersRepository.findOneBy({ id: payload.sub });
  if (payload?.signature !== user?.signature) return null;
  return user;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    configService: ConfigService,
  ) {
    super(extractJwt(configService));
  }

  async validate(payload: Payload) {
    const user = await validate(payload, this.usersRepository);
    return user;
  }
}
