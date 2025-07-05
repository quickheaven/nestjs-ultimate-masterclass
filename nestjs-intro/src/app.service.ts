import { Injectable } from '@nestjs/common';
import { DummyService } from './dummy/dummy.service'; // Adjust the import path as necessary

@Injectable()
export class AppService {
constructor(
  private readonly dummyService: DummyService, // Assuming DummyService is imported correctly
) {}

  getHello(): string {
    return `Hello World! ${this.dummyService.work()}`;
  }
}
