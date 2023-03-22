import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  InjectDataSource,
  // InjectRepository,
} from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/entities/user.entity';
import {
  DataSource,
  //Repository,
  SelectQueryBuilder,
} from 'typeorm';

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

const validate = async (payload: Payload, userQuery: SelectQueryBuilder<User>) => {
  const user = await userQuery.where('id = :id', { id: payload.sub }).getOne();
  if (payload?.signature !== user?.signature) return null;
  return user;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // @InjectRepository(User)
    // private readonly usersRepository: Repository<User>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    configService: ConfigService,
  ) {
    super(extractJwt(configService));
  }

  async validate(payload: Payload) {
    const userQuery = this.dataSource.createQueryBuilder(User, 'user');

    const user = await validate(payload, userQuery);
    return user;
  }
}
