import { Injectable } from '@nestjs/common';
import { DummyService } from './dummy/dummy.service'; // Adjust the import path as necessary
import { LoggerService } from './logger/logger.service';
import { AppConfig } from './config/app.config';
import { TypedConfigService } from './config/type-config.service';

@Injectable()
export class AppService {
  constructor(
    private readonly dummyService: DummyService, // Assuming DummyService is imported correctly
    private readonly loggerService: LoggerService,
    private readonly configService: TypedConfigService, // Import ConfigService to access configuration
  ) {}

  getHello(): string {
    const prefix = this.configService.get<AppConfig>('app')?.messagePrefix;
    return this.loggerService.log(
      `${prefix} Hello World! ${this.dummyService.work()}`,
    );
  }
}
