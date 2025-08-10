// src/chat/chat.gateway.ts

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`✅ Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.roomId);
    console.log(`👥 Client ${client.id} joined room ${data.roomId}`);

    client.emit('joinedRoom', { roomId: data.roomId });
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @MessageBody() data: { roomId: string; senderId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(
      `💬 Message from ${data.senderId} in room ${data.roomId}: ${data.content}`,
    );

    // Broadcast to everyone in the room
    this.server.to(data.roomId).emit('newMessage', {
      senderId: data.senderId,
      content: data.content,
      roomId: data.roomId,
    });
  }
}
