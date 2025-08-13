import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { RoomModule } from './room/room.module';
import { MessageService } from './message/message.service';
import { MessageModule } from './message/message.module';
import { ChatModule } from './chat/chat.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AuthModule, PrismaModule, RoomModule, MessageModule, ChatModule],
  controllers: [AppController],
  providers: [ MessageService , AppService ],
})
export class AppModule {}
