import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedisIoAdapter } from './adapters/redis.adapter';
import { AppModule } from './app.module';
import { NotFoundExceptionFilter } from './errors/catch.dto';
import * as compression from 'compression';
// somewhere in your initialization file

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(compression());
  app.useGlobalFilters(new NotFoundExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  // app.useWebSocketAdapter(new RedisIoAdapter(app));

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Mock Project')
    .setDescription('Mock Project')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  await app.listen(port);
}
bootstrap();
