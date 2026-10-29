import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SERVICES_PORT } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ENABLE VALIDATION
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(SERVICES_PORT.API_GATEWAY ?? 6000);
  console.log(`API Gateway is running on port ${SERVICES_PORT.API_GATEWAY}`);
}
bootstrap();
