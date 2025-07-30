import { Injectable } from '@nestjs/common';
export class MessageFormatterService {
  formatMessage(message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${message}`;
  }
}
