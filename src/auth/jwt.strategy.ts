import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your-secret-key', // TODO: generate dynamic secret key.
      
    });
  }

  async validate(payload: any) {
    // TODO: upon validate, only return non-sensitive information and create an entry in the database to track the user's activity.    
    return { id: payload.id, isAdmin: payload.isAdmin }; // Attach decoded payload to request.user

  }
}
