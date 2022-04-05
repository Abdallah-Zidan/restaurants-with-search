import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT || 3333;

  const allowedOrigins = (
    process.env.ALLOWED_ORIGINS ?? `http://localhost:${port}`
  )
    .split(',')
    .map((o) => o.trim());

  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({ origin: allowedOrigins });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}
bootstrap();
