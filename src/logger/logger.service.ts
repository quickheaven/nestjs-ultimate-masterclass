import { Injectable } from '@nestjs/common';
import { MessageFormatterService } from '../message-formatter/message-formatter.service';

@Injectable()
export class LoggerService {
  constructor(
    private readonly messageFormatterService: MessageFormatterService, // Assuming MessageFormatterService is imported correctly
  ) {}

  log(message: string): string {
    const formattedMessage =
      this.messageFormatterService.formatMessage(message);
    return formattedMessage;
  }
}
