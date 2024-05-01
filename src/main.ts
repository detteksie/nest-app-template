import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { setupApp } from './setup-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // bodyParser: false,
    rawBody: true,
    cors: true,
    // logger: ['verbose', 'log', 'debug', 'warn', 'error', 'fatal'],
  });
  setupApp(app);

  const documentBuilder = new DocumentBuilder();
  const config = documentBuilder
    .setTitle('Nest Application')
    .setDescription('Template for Nest Application')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
