import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import moment from 'moment-timezone';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Web Scraper API')
    .setDescription('API for crawling websites and extracting data')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  moment.tz.setDefault('Asia/Dubai')

  await app.listen(3000);
}

bootstrap();
