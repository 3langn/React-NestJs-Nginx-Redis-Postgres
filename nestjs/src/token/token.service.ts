import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenPayloadDto } from '../auth/dto/token-payload.dto';
import constants from '../common/constants/constants';
import { TokenType } from '../common/constants/enum';
import { UserEntity } from '../user/user';
import { Tokens } from './token.entity';
@Injectable()
export class TokenService {
  private logger = new Logger(TokenService.name);
  constructor(
    @InjectRepository(Tokens) private tokenRepo: Repository<Tokens>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAuthToken(user: UserEntity): Promise<TokenPayloadDto> {
    const accessToken = this.generateToken(
      user,
      this.configService.get(constants.JWT_ACCESS_EXPIRATION),
    );
    const refreshToken = this.generateToken(
      user,
      this.configService.get(constants.JWT_REFRESH_EXPIRATION),
    );
    await this.saveToken(refreshToken, user, TokenType.RefreshToken);
    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(token: string, user: UserEntity, tokenType: TokenType) {
    let tokenDoc = await this.tokenRepo.findOne({
      where: { user },
    });
    if (tokenDoc) {
      tokenDoc.token = token;
      tokenDoc.active = true;
    } else {
      tokenDoc = this.tokenRepo.create({
        token,
        user,
        type: tokenType,
      });
    }
    return this.tokenRepo.save(tokenDoc);
  }

  generateToken(user: UserEntity, expires: string | number) {
    const payload = { sub: user.id };

    return this.jwtService.sign(payload, {
      expiresIn: expires,
      secret: this.configService.get(constants.JWT_SECRET_KEY),
    });
  }

  async verifyToken(token: string, type: TokenType) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get(constants.JWT_SECRET_KEY),
      });
      if (type !== TokenType.AccessToken) {
        const tokenDoc = await this.tokenRepo.findOne({
          relations: ['user'],
          where: {
            token,
            type,
            user: payload.sub,
          },
        });

        if (!tokenDoc) {
          throw new Error('Token does not exist');
        }
        if (type === TokenType.VerifyEmailToken) {
          tokenDoc.active = false;
        }
        await this.tokenRepo.save(tokenDoc);
        return tokenDoc.user;
      }
      return await this.userRepo.findOne({ where: { id: payload.sub } });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async refreshToken(token: string) {
    const tokenPayload = await this.verifyToken(token, TokenType.RefreshToken);
    return this.generateAuthToken(tokenPayload);
  }

  async generateVerifyEmailToken(user: UserEntity) {
    const verifyEmailToken = this.generateToken(
      user,
      this.configService.get(constants.JWT_VERIFY_EMAIL_EXPIRATION),
    );
    await this.saveToken(verifyEmailToken, user, TokenType.VerifyEmailToken);
    return verifyEmailToken;
  }

  async generateResetPasswordToken(userEmail: string) {
    const user = await this.userRepo.findOne({ where: { email: userEmail } });
    if (!user) {
      throw new NotFoundException('Email does not exist');
    }
    const refreshPasswordToken = this.generateToken(
      user,
      this.configService.get(constants.JWT_RESET_PASSWORD_EXPIRATION),
    );
    return await this.saveToken(
      refreshPasswordToken,
      user,
      TokenType.RefreshPasswordToken,
    );
  }
}
