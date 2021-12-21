import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { UserService } from './users.service';
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  private logger = new Logger(UsersController.name);
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(@Query('userId') userId: string) {
    const user = await this.userService.getOneUser(userId);

    return user;
  }

  // friends
  @Get('friends')
  async getFriends(@Query('userId') userId: string) {
    // return await this.userService.findOne({ where: { id: userId } });
  }

  @Get('/all')
  async getUsers() {
    const users = await this.userService.find({});
    return users;
  }

  // follow user
  @Put('/:userId/follow')
  async followUser(@Request() req, @Param('userId') userId: string) {
    return await this.userService.followUser(req.user, userId);
  }

  // unfollow user
  @Put('/:userId/unfollow')
  async unfollowUser(@Request() req, @Param('userId') userId: string) {
    return await this.userService.unFollowUser(req.user, userId);
  }

  // add friend
  @Post('addFriend')
  async addFriend(@Request() req, @Body('friendId') friendId: string) {
    await this.userService.addFriend(req.user, friendId);
  }
}
