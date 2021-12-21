import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommentEntity } from 'src/entity/comment';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostDto } from './dto/post-request.dto';
import { PostEntity } from './post';
import { PostService } from './post.service';
import { internet } from 'faker';

@ApiTags('Post')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/')
  async createPost(@Body() postDto: PostDto, @Req() req): Promise<PostEntity> {
    const postPayload = await this.postService.createPost(postDto, req.user);
    return postPayload;
  }

  @Delete('/:postId')
  async deletePost(
    @Param('postId') postId: string,
    @Request() req,
  ): Promise<void> {
    await this.postService.deletePost(postId, req.user);
  }

  @Get('/timeline')
  async getTimeline(@Request() req): Promise<PostEntity[]> {
    const posts = await this.postService.getUserTimeline(req.user);
    return posts;
  }

  @Get('/profile/:userId')
  async getUserPosts(@Param('userId') userId: string): Promise<PostEntity[]> {
    const posts = await this.postService.getUserPosts(userId);
    return posts;
  }

  @Put('/:postId/like')
  updatePostLikes(
    @Param('postId') postId: string,
    @Request() req,
  ): Promise<PostEntity> {
    return this.postService.updatePostLikes(postId, req.user);
  }
  // get post comments
  @Get('/:postId/comments')
  async getPostComments(
    @Param('postId') postId: string,
  ): Promise<CommentEntity[]> {
    const comments = await this.postService.getPostComments(postId);
    return comments;
  }

  // comment
  @Post('/:postId/comments')
  async createComment(
    @Param('postId') postId: string,
    @Body() body: any,
    @Request() req,
  ): Promise<void> {
    await this.postService.createComment(postId, req.user, body.comment);
  }

  @Put('/:postId')
  async updatePost(
    @Param() postId: string,
    @Body() postDto: PostDto,
    @Request() req,
  ): Promise<PostEntity> {
    await this.postService.checkUserOwnsPost(postId, req.user);
    const postPayload = await this.postService.updatePost(postDto);
    return postPayload;
  }

  @Post('/seed')
  async seedPost(@Request() req) {
    let postPayload: Promise<PostEntity>[] = [];
    for (let index = 0; index < 1000; index++) {
      const post: PostDto = {
        description: `Post ${index}`,
        image: internet.email(),
      };
      postPayload.push(this.postService.createPost(post, req.user));
    }
    return await Promise.all(postPayload);
  }

  @Delete('/delete-post')
  async deleteAllPost() {
    await this.postService.deleteAll();
  }
}
