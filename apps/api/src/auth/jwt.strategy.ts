import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

/** JWT token payload shape */
interface JwtPayload {
  sub: string; // User ID
  email: string;
}

/**
 * Passport JWT strategy.
 * Extracts the JWT from the Authorization header (Bearer token),
 * validates it, and attaches the user object to the request.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'JWT_SECRET',
        'bookit-dev-secret',
      ),
    });
  }

  /**
   * Called after JWT is validated. Returns the user object
   * that will be attached to request.user.
   */
  async validate(payload: JwtPayload) {
    const user = await this.authService.findUserById(payload.sub);
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
