import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // 👈 Important for cross-origin
  app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(3000); // 👈 Make sure it's 3001
}
bootstrap();
