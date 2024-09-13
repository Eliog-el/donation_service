import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { EnvService } from './common/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const env = new EnvService().read();

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Donation Service API')
    .setDescription('API documentation for Donation Service')
    .setVersion('1.0')
    .addTag('donations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(env.APP_PORT);
  console.log(`Application is running on: ${await app.getUrl()}/api`);
}
bootstrap();
