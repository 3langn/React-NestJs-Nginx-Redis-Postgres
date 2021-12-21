import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { EmailService, SendMailVerifyDto } from 'src/email/email.service';
import { RolesEnum, TokenType } from '../common/constants/enum';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { TokenService } from '../token/token.service';
import { UserLoginDto } from '../user/dto/user-login.dto';
import { UserRegisterDto } from '../user/dto/user-register.dto';
import { UserDto } from '../user/dto/user.dto';
import { Serialize } from '../user/users.interceptor';
import { UserService } from '../user/users.service';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
@ApiTags('Authentication')
@Controller('/auth')
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
  ) {}

  @Serialize(UserDto)
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: UserDto,
  })
  @Post('/register')
  async registerUser(@Body() userRegisterDto: UserRegisterDto) {
    try {
      const user = await this.userService.createUserRegister(userRegisterDto);
      // const emailToken = await this.tokenService.generateVerifyEmailToken(user);
      // await this.emailService.sendVerificationEmail({
      //   to: userRegisterDto.email,
      //   token: emailToken,
      // });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  @ApiOkResponse({ description: 'Success', type: LoginResponseDto })
  @HttpCode(200)
  @Post('/login')
  async login(@Body() userLoginDto: UserLoginDto): Promise<any> {
    const user = await this.authService.validateUser(userLoginDto);
    const tokens = await this.tokenService.generateAuthToken(user);
    return {
      user,
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  @Post('/refresh-token')
  async refreshToken(@Body() refreshToken: string) {
    const tokens = await this.tokenService.refreshToken(refreshToken);
    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  // verify email
  @ApiOkResponse({ description: 'Success' })
  @Get('/verify-email')
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    const user = await this.tokenService.verifyToken(
      token,
      TokenType.VerifyEmailToken,
    );
    await this.authService.verifyEmail(user);
    res.redirect('http://localhost:3000');
  }

  @Get('/test')
  async hello(@Request() req) {
    return await this.userService.getAllUsers();
  }
}
