import { BadGatewayException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ConversationService } from 'src/conversation/conversation.service';
import { TokenType } from '../common/constants/enum';
import { TokenService } from '../token/token.service';

@WebSocketGateway({ path: '/api/socket.io' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger(ChatGateway.name);
  constructor(
    private tokenSerivce: TokenService,
    private readonly conversationService: ConversationService,
  ) {}
  @WebSocketServer()
  server;

  connectedUsers: string[] = [];
  async handleDisconnect(client) {
    try {
      const user = await this.tokenSerivce.verifyToken(
        client.handshake.query.token,
        TokenType.AccessToken,
      );
      const userPos = this.connectedUsers.indexOf(user.id);

      if (userPos > -1) {
        this.connectedUsers = [
          ...this.connectedUsers.slice(0, userPos),
          ...this.connectedUsers.slice(userPos + 1),
        ];
      }
      this.logger.debug(user.username + ' disconnect');
      client.leaveAll();
      // // Sends the new list of connected users
      this.server.emit('users', this.connectedUsers);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async handleConnection(client) {
    try {
      const user = await this.tokenSerivce.verifyToken(
        client.handshake.query.token,
        TokenType.AccessToken,
      );

      this.connectedUsers = [...this.connectedUsers, user.id];
      console.log(user.username + ' connected');
      this.server.emit('users', this.connectedUsers);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @SubscribeMessage('message')
  async onMessage(client, data: any) {
    const event: string = 'message';

    const message = await this.conversationService.createMessage(
      data.conversationId,
      data.content,
      data.senderId,
    );
    this.logger.debug('Room: ' + data.conversationId);
    client.broadcast.to(data.conversationId).emit(event, message);
  }

  @SubscribeMessage('join')
  async onRoomJoin(client, data: any): Promise<any> {
    if (data.conversationId === undefined) {
      return;
    }
    client.join(data?.conversationId);

    const messages = await this.conversationService.getMessages(
      data.conversationId,
    );
    this.logger.debug('User join' + data?.conversationId);
    // Send last messages to the connected user
    // client.emit('message', messages);
  }

  @SubscribeMessage('leave')
  onRoomLeave(client, data: any): void {
    client.leave(data[0]);
  }
}
