// @ts-nocheck
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { IJwtPayload } from '../common/interfaces/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.jwtSecret'),
      algorithms: ['HS256'],
    });
  }

  async validate(payload: IJwtPayload) {
    try {
      // Validate the user exists and is active
      const user = await this.authService.validateUser(payload);
      
      if (!user) {
        throw new UnauthorizedException('User not found or inactive');
      }

      // Return user object that will be attached to request
      return {
        id: user.id,
        kindeId: user.kindeId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        subscription: user.subscription,
      };
    } catch (error) {
      throw new UnauthorizedException('Token validation failed');
    }
  }
}

// Additional Kinde-specific strategy for webhook validation
@Injectable()
export class KindeStrategy extends PassportStrategy(Strategy, 'kinde') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('token'), // For Kinde webhooks
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.kindeSecret'),
      algorithms: ['RS256'], // Kinde uses RS256
    });
  }

  async validate(payload: any) {
    try {
      // Validate Kinde webhook payload
      return await this.authService.validateKindeUser(payload);
    } catch (error) {
      throw new UnauthorizedException('Kinde token validation failed');
    }
  }
}