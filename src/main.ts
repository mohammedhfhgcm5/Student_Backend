import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ الوصول الصحيح لمجلد uploads خارج dist
  const uploadsPath = join(__dirname, '..', '..', 'uploads');

  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  console.log('📂 Serving static files from:');
  console.log('➡️ ', uploadsPath);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Server running on http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
