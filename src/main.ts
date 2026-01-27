import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { seedAdmin } from './seeders/admin.seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // DEBUG: env loaded 
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






  //  FIXED CORS CONFIG
  app.enableCors({
    origin: [
      'http://localhost:3000', // frontend
      'http://localhost:3001', // custom any frontend or admin pannell 
      'http://localhost:3002', // admin panel
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT || 4000);
  console.log(`🚀 Server running on port ${process.env.PORT || 4000}`);
}

bootstrap();
