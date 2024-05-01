import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '~/modules/auth/auth.service';
// import { jsonStringify } from '~/utils/json-stringify.util';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private authService: AuthService) {
    super({ usernameField: 'userSession' });
  }

  async validate(userSession: string, password: string): Promise<any> {
    // this.logger.debug(jsonStringify({ userSession, password }), 'login');
    const user = await this.authService.validateUser({ userSession, password });
    if (!user) {
      throw new UnauthorizedException('email/username or password is invalid');
    }
    return user;
  }
}
