import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/users.service';
import constants from '../../shared/constants/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger(JwtStrategy.name);
  constructor(private readonly configService: ConfigService, private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(constants.JWT_SECRET_KEY),
      ignoreExpired: false,
    });
  }

  async validate(payload: any) {
    this.logger.debug(`validate payload: ${JSON.stringify(payload)}`);
    const user = await this.userService.getOneUser(payload.sub);
    // if (!user.emailVerified) {
    //   throw new BadRequestException('Email not verified');
    // }
    return user;
  }
}
