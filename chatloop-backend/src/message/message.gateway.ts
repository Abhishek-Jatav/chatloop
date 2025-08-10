import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private readonly messageService: MessageService) {}

  handleConnection(client: Socket) {
    console.log(`✅ Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, payload: { roomId: string }) {
    client.join(payload.roomId);
    console.log(`👥 Client ${client.id} joined room ${payload.roomId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    client: Socket,
    payload: { roomId: string; senderId: string; content: string },
  ) {
    const { roomId, senderId, content } = payload;

    // 1. Save to DB
    const saved = await this.messageService.createMessage({
      roomId,
      senderId,
      content,
    });

    // 2. Emit to room
    this.server.to(roomId).emit('message', saved);

    console.log(`💬 Message from ${senderId} in room ${roomId}: ${content}`);
  }
}
