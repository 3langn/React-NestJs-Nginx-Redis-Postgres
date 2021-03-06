import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/config';
import { DatabaseConfig } from './config/database.config';
import { PostModule } from './post/post.module';
import { UploadModule } from './upload/upload.module';
import { RedisCacheModule } from './shared/redis-cache/redis-cache.module';
import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';
import { EmailModule } from './email/email.module';
import { ConversationModule } from './conversation/conversation.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({ useClass: DatabaseConfig }),
    UsersModule,
    AuthModule,
    PostModule,
    UploadModule,
    RedisCacheModule,
    ChatModule,
    EmailModule,
    ConversationModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
