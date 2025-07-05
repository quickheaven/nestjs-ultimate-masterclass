import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ITask } from './tasks.model';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from './find-one.params';
import { UpdateTaskStatusDto } from './update-task-status.dto';
import { UpdateTaskDto } from './update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @Get()
  public findAll(): ITask[] {
    return this.tasksService.findAll();
  }

  /*
  @Get('/:id')
  public findOne(@Param('id') id: string): ITask {
    const task = this.tasksService.findOne(id);
    if (task) {
      return task;
    }
    throw new NotFoundException();
  }  
  */
  @Get('/:id')
  public findOne(@Param('id') params: FindOneParams): ITask {
    return this.findOneOrFail(params.id);
  }

  @Post()
  public createTask(@Body() createTaskDto: CreateTaskDto): ITask {
    return this.tasksService.createTask(createTaskDto);
  }

  @Patch('/:id/status')
  public updateTaskStatus(
    @Param() param: FindOneParams,
    @Body() body: UpdateTaskStatusDto,
  ): ITask {
    const task = this.findOneOrFail(param.id);
    task.status = body.status;
    return task;
  }

  private findOneOrFail(id: string): ITask {
    const task = this.tasksService.findOne(id);
    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public deleteTask(@Param('id') id: string): void {
    const task = this.tasksService.findOne(id);
    if (!task) {
      throw new NotFoundException();
    }
    this.tasksService.deleteTask(task);
  }

  @Patch('/:id')
  public updatTask(
    @Param() param: FindOneParams,
    @Body() updateTaskDto: UpdateTaskDto,
  ): ITask {
    const task = this.findOneOrFail(param.id);
    return this.tasksService.updateTask(task, updateTaskDto);
  }
}
