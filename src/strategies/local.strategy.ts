import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private authService: AuthService) {
    super({ usernameField: 'userSession' });
  }

  async validate(userSession: string, password: string): Promise<any> {
    this.logger.debug(`${{ userSession, password }}`, 'login');
    const user = await this.authService.validateUser({ userSession, password });
    if (!user) {
      throw new UnauthorizedException('Email/Username or Password is invalid!');
    }
    return user;
  }
}
