import { Controller, Get, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ITask } from './tasks.model';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @Get()
  public findAll(): ITask[] {
    return this.tasksService.findAll();
  }

  @Get('/:id')
  public findOne(@Param('id') id: string): ITask | undefined {
    return this.tasksService.findOne(id);
  }
}
