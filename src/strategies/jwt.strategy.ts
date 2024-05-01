import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  InjectDataSource,
  // InjectRepository,
} from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  DataSource,
  //Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '~/constants/env.constant';
import { User } from '~/entities/user.entity';
// import { jsonStringify } from '~/utils/json-stringify.util';

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

const validate = async (
  payload: Payload,
  userQuery: SelectQueryBuilder<User>,
  cacheManager: Cache,
) => {
  const cacheKey = `user#${payload.sub}`;
  let user: User = await cacheManager.get<User>(cacheKey);
  // let user: User = null;
  if (!user) {
    user = await userQuery
      .where('id = :id', { id: payload.sub })
      .cache(cacheKey, 1000 * 60 * 15)
      .getOne();
    if (user) {
      await cacheManager.set(cacheKey, user, 60 * 60 * 1000);
    }
  }
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
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    configService: ConfigService,
  ) {
    super(extractJwt(configService, JWT_ACCESS_SECRET));
  }

  async validate(req: Request, payload: Payload) {
    // this.logger.debug(jsonStringify(payload), 'access-payload');
    const userQuery = this.dataSource.createQueryBuilder(User, 'user');

    const user = await validate(payload, userQuery, this.cacheManager);
    // const user = await validate(payload, userQuery);
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
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    configService: ConfigService,
  ) {
    super(extractJwt(configService, JWT_REFRESH_SECRET));
  }

  async validate(req: Request, payload: Payload) {
    // this.logger.debug(jsonStringify(payload), 'refresh-payload');
    const userQuery = this.dataSource.createQueryBuilder(User, 'user');

    const user = await validate(payload, userQuery, this.cacheManager);
    // const user = await validate(payload, userQuery);
    return user;
  }
}
