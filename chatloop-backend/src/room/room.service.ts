import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async createRoom(userId: string, body: { name: string; isGroup?: boolean }) {
    const { name, isGroup = false } = body;

    const room = await this.prisma.room.create({
      data: {
        name,
        isGroup,
        participants: {
          create: {
            userId,
          },
        },
      },
    });

    return {
      message: 'Room created successfully',
      room,
    };
  }

  async joinRoom(roomId: string, userId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Optional: Check if already joined
    const alreadyJoined = await this.prisma.participant.findFirst({
      where: { roomId, userId },
    });

    if (alreadyJoined) {
      return { message: 'User already joined the room', roomId };
    }

    await this.prisma.participant.create({
      data: {
        roomId,
        userId,
      },
    });

    return { message: 'Joined room successfully', roomId };
  }

  async getJoinedRooms(userId: string) {
    return this.prisma.room.findMany({
      where: {
        participants: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        participants: true,
      },
    });
  }

  async getRoomUsers(roomId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!room) {
      throw new Error('Room not found');
    }

    return room.participants.map((p) => p.user);
  }

  async leaveRoom(roomId: string, userId: string) {
    const participant = await this.prisma.participant.findFirst({
      where: {
        roomId,
        userId,
      },
    });

    if (!participant) {
      throw new NotFoundException('User is not part of this room');
    }

    return this.prisma.participant.delete({
      where: {
        id: participant.id,
      },
    });
  }

  async getRoomMessages(roomId: string, userId: string) {
    const isParticipant = await this.prisma.participant.findFirst({
      where: {
        roomId,
        userId,
      },
    });

    if (!isParticipant) {
      throw new ForbiddenException('You are not part of this room');
    }

    return this.prisma.message.findMany({
      where: {
        roomId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  async sendMessage(roomId: string, userId: string, content: string) {
    console.log('🚀 ~ userId:', userId); // Check if it's undefined

    if (!userId) throw new Error('userId is required');

    const message = await this.prisma.message.create({
      data: {
        content,
        roomId,
        senderId: userId, // ✅ Must NOT be undefined
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return message;
  }

  // message.service.ts
  async getMessagesByRoom(roomId: string) {
    return this.prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: true, // ✅ optional if you want to show sender name
      },
    });
  }

  async createMessage(data: {
    userId: string;
    roomId: string;
    content: string;
  }) {
    return this.prisma.message.create({
      data: {
        content: data.content,
        senderId: data.userId,
        roomId: data.roomId,
      },
      include: {
        sender: true,
      },
    });
  }

  async getAllRooms() {
    return this.prisma.room.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });
  }

  async getJoinedAndNotJoinedRooms(userId: string) {
    // Joined rooms
    const joinedRooms = await this.prisma.room.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      include: {
        participants: true,
      },
    });

    // Not joined rooms
    const notJoinedRooms = await this.prisma.room.findMany({
      where: {
        participants: {
          none: { userId },
        },
      },
      include: {
        participants: true,
      },
    });

    return {
      joinedRooms,
      notJoinedRooms,
    };
  }
}
