import { Injectable } from '@nestjs/common';
import { DummyService } from './dummy/dummy.service'; // Adjust the import path as necessary
import { LoggerService } from './logger/logger.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private readonly dummyService: DummyService, // Assuming DummyService is imported correctly
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService, // Import ConfigService to access configuration
  ) {}

  getHello(): string {
    const prefix =
      this.configService.get<string>('app.messagePrefix') || 'Hello';
    return this.loggerService.log(
      `${prefix} Hello World! ${this.dummyService.work()}`,
    );
  }
}
