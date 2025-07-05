import { Injectable } from '@nestjs/common';
import { DummyService } from './dummy/dummy.service'; // Adjust the import path as necessary
import { LoggerService } from './logger/logger.service';

@Injectable()
export class AppService {
  constructor(
    private readonly dummyService: DummyService, // Assuming DummyService is imported correctly
    private readonly loggerService: LoggerService,
  ) {}

  getHello(): string {
    return this.loggerService.log(`Hello World! ${this.dummyService.work()}`);
  }
}
