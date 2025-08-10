import { Controller, Get, Param } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':roomId')
  async getMessages(@Param('roomId') roomId: string) {
    return this.messageService.getMessagesByRoomId(roomId);
  }
}
