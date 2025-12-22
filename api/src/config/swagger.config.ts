import {
  DocumentBuilder,
  OpenAPIObject,
  SwaggerCustomOptions,
} from '@nestjs/swagger';

export const documentConfig: Omit<OpenAPIObject, 'paths'> =
  new DocumentBuilder()
    .setTitle('PerlinLaw - Web App')
    .setDescription(
      'Api documentation for the PerlinLaw web app. This is a full-stack Node.js application. Made by C. H. Perlin.',
    )
    .setVersion('ALPHA 0.1')
    .setContact(
      'Author',
      'https://blog.caioperlin.dev',
      'caiohperlin@gmail.com',
    )
    .build();

export const customOptions: SwaggerCustomOptions = {
  customSiteTitle: 'PerlinLaw Docs',
};
