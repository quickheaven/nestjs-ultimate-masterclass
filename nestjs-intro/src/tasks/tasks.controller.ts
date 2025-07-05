import { Controller, Get, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @Get()
  public findAll(): string[] {
    return ['A', 'B'];
  }

  /*
  @Get('/:id')
  public findOne(@Param() params: any): string {
    return `This number is ${params.id}`;
  }
  */
  @Get('/:id')
  public findOne(@Param('id') id: string): string {
    return `This number is ${id}`;
  }
}
