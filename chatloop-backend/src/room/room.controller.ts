import { Body, Controller, Post, Get, UseGuards, Req, Param } from '@nestjs/common';
import { Request } from 'express';
import { RoomService } from './room.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '@prisma/client/runtime/library';

@UseGuards(JwtAuthGuard)
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('create')
  async createRoom(
    @Req() req: Request,
    @Body() body: { name: string; isGroup?: boolean },
  ) {
    const userId = req.user?.sub;
    return this.roomService.createRoom(userId, body);
  }

  @Post('join')
  async joinRoom(
    @Req() req: Request, // ✅ FIXED: use @Req()
    @Body('roomId') roomId: string,
  ) {
    const userId = req.user?.sub;
    return this.roomService.joinRoom(roomId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('joined')
  async getJoinedRooms(@Req() req: Request) {
    const userId = req.user.sub;
    return this.roomService.getJoinedRooms(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':roomId/users')
  async getRoomUsers(@Param('roomId') roomId: string) {
    return this.roomService.getRoomUsers(roomId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('leave')
  async leaveRoom(@Req() req: Request, @Body('roomId') roomId: string) {
    const userId = req.user?.sub;
    return this.roomService.leaveRoom(roomId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':roomId/messages')
  async getRoomMessages(@Param('roomId') roomId: string, @Req() req: Request) {
    const userId = req.user?.sub;
    return this.roomService.getRoomMessages(roomId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':roomId/messages')
  async sendMessage(
    @Param('roomId') roomId: string,
    @Req() req: Request,
    @Body('content') content: string,
  ) {
    const userId = req.user?.sub;
    return this.roomService.sendMessage(roomId, userId, content);
  }

  @Get()
  async getAllRooms() {
    return this.roomService.getAllRooms();
  }

  @UseGuards(JwtAuthGuard)
  @Get('joined-and-not')
  async getJoinedAndNotJoined(@Req() req: Request) {
    const userId = req.user?.sub;
    return this.roomService.getJoinedAndNotJoinedRooms(userId);
  }
}
