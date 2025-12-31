import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { seedAdmin } from './seeders/admin.seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // DEBUG: env loaded কিনা চেক
  console.log('ENV CHECK:', {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    API_KEY: process.env.CLOUDINARY_API_KEY ? 'FOUND' : 'MISSING',
  });



  // Seeder (optional but ok for now)
  await seedAdmin();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  await app.listen(process.env.PORT || 4000);
  console.log(`🚀 Server running on port ${process.env.PORT || 4000}`);
}

bootstrap();
