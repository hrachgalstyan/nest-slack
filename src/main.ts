import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import * as morgan from 'morgan';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const serverConfig = config.get('server');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableVersioning();
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setGlobalPrefix('api/v1');

  app.use(morgan('dev'));
  const port = serverConfig.port;
  await app.listen(port);
}

bootstrap();
