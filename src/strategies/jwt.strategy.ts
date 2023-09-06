import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  InjectDataSource,
  // InjectRepository,
} from '@nestjs/typeorm';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from 'src/constants/env.constant';
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

const extractJwt = (configService: ConfigService, secret: string) => {
  return {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    secretOrKey: configService.get<string>(secret),
    passReqToCallback: true,
  };
};

const validate = async (payload: Payload, userQuery: SelectQueryBuilder<User>) => {
  const user = await userQuery.where('id = :id', { id: payload.sub }).getOne();
  if (payload?.signature !== user?.signature) return null;
  return user;
};

// Access Token
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  private readonly logger = new Logger(AccessTokenStrategy.name);

  constructor(
    // @InjectRepository(User)
    // private readonly usersRepository: Repository<User>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    configService: ConfigService,
  ) {
    super(extractJwt(configService, JWT_ACCESS_SECRET));
  }

  async validate(req: Request, payload: Payload) {
    this.logger.debug(JSON.stringify(payload, null, 2), 'access-payload');
    const userQuery = this.dataSource.createQueryBuilder(User, 'user');

    const user = await validate(payload, userQuery);
    return user;
  }
}

// Refresh Token
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  private readonly logger = new Logger(RefreshTokenStrategy.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    configService: ConfigService,
  ) {
    super(extractJwt(configService, JWT_REFRESH_SECRET));
  }

  async validate(req: Request, payload: Payload) {
    this.logger.debug(JSON.stringify(payload, null, 2), 'refresh-payload');
    const userQuery = this.dataSource.createQueryBuilder(User, 'user');

    const user = await validate(payload, userQuery);
    return user;
  }
}
