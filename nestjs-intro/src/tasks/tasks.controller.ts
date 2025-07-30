import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from './find-one.params';
import { UpdateTaskStatusDto } from './update-task-status.dto';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status-exception';
import { Task } from './task.entity';
import { CreateTaskLabelDto } from './create-task-label.dto';
import { FindTaskParams } from './find-task-params';
import { PaginationParams } from '../common/pagination.params';
import { PaginationResponse } from '../common/pagination.response';
import { CurrentUserId } from './../users/decorators/current-user-id.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @Get()
  public async findAll(
    @Query() filters: FindTaskParams,
    @Query() pagination: PaginationParams,
  ): Promise<PaginationResponse<Task>> {
    const [items, total] = await this.tasksService.findAll(filters, pagination);

    return {
      data: items,
      meta: {
        total,
        ...pagination,
        //offset: pagination.offset,
        //limit: pagination.limit,
      },
    };
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
  public async findOne(
    @Param() params: FindOneParams,
    @CurrentUserId() userId: string,
  ): Promise<Task> {
    const task = await this.findOneOrFail(params.id);
    this.checkTaskOwnership(task, userId);
    return task;
  }

  @Post()
  public async createTask(
    @Body() createTaskDto: CreateTaskDto,
    // @Request() request: AuthRequest,
    @CurrentUserId() userId: string,
  ): Promise<Task> {
    return await this.tasksService.createTask({
      ...createTaskDto,
      userId
    });
  }

  @Patch('/:id/status')
  public async updateTaskStatus(
    @Param() param: FindOneParams,
    @Body() body: UpdateTaskStatusDto,
  ): Promise<Task> {
    const task = await this.findOneOrFail(param.id);

    const updateTaskDto = new UpdateTaskDto();
    updateTaskDto.status = body.status;
    try {
      return await this.tasksService.updateTask(task, updateTaskDto);
    } catch (error) {
      if (error instanceof WrongTaskStatusException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  private async findOneOrFail(id: string): Promise<Task> {
    console.log(`Finding task with id: ${id}`);
    const task = await this.tasksService.findOne(id);
    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteTask(
    @Param() param: FindOneParams,
    @CurrentUserId() userId: string,
  ): Promise<void> {
    const task = await this.findOneOrFail(param.id);
    this.checkTaskOwnership(task, userId);
    await this.tasksService.deleteTask(task);
  }

  @Patch('/:id')
  public async updateTask(
    @Param() param: FindOneParams,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUserId() userId: string,
  ): Promise<Task> {
    const task = await this.findOneOrFail(param.id);
    this.checkTaskOwnership(task, userId);
    try {
      return await this.tasksService.updateTask(task, updateTaskDto);
    } catch (error) {
      if (error instanceof WrongTaskStatusException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Post('/:id/labels')
  @HttpCode(HttpStatus.CREATED)
  public async addLabels(
    @Param() { id }: FindOneParams,
    @Body() labelDtos: CreateTaskLabelDto[],
    @CurrentUserId() userId: string,
  ): Promise<Task> {
    const task = await this.findOneOrFail(id);
    this.checkTaskOwnership(task, userId);
    return await this.tasksService.addLabels(task, labelDtos);
  }

  @Delete('/:id/labels')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async removeLabels(
    @Param() { id }: FindOneParams,
    @Body() labelNames: string[],
    @CurrentUserId() userId: string,
  ): Promise<void> {
    const task = await this.findOneOrFail(id);
    this.checkTaskOwnership(task, userId);
    await this.tasksService.removeLabels(task, labelNames);
  }

  private checkTaskOwnership(task: Task, userId: string): void {
    if (task.userId !== userId) {
      throw new ForbiddenException('You can only access your own tasks');
    }
  }
}
