import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { EnvironmentVariables } from './config/environment-variables';
import { customOptions, documentConfig } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: /^http:\/\/localhost(:\d+)?$/,
  });
  app.setGlobalPrefix('api');

  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('docs', app, document, customOptions);

  const port = app.get(ConfigService<EnvironmentVariables>).get('PORT');
  await app.listen(port);
}
bootstrap();
