import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/users.service';
import { Repository } from 'typeorm';
import constants from '../../common/constants/constants';
import { UserEntity } from '../../user/user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(constants.JWT_SECRET_KEY),
      ignoreExpired: false,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.getOneUser(payload.sub);

    // if (!user.emailVerified) {
    //   throw new BadRequestException('Email not verified');
    // }
    return user;
  }
}
