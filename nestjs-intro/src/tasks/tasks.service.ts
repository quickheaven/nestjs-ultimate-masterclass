import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status-exception';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './tasks.model';
import { CreateTaskLabelDto } from './create-task-label.dto';
import { TaskLabel } from './task-label.entity';
import { FindTaskParams } from './find-task-params';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(TaskLabel)
    private readonly labelsRepository: Repository<TaskLabel>,
  ) {}

  public async findAll(filters: FindTaskParams): Promise<Task[]> {
    return await this.taskRepository.find({
      where: {
        status: filters.status,
      },
      relations: ['labels'],
    });
  }

  public async findOne(id: string): Promise<Task | null> {
    // return await this.taskRepository.findOneBy({ id });
    return await this.taskRepository.findOne({
      where: { id },
      relations: ['labels'], // Include labels relation if needed
    });
  }

  public async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    if (createTaskDto.labels) {
      // Ensure labels are unique by name
      createTaskDto.labels = this.getUniqueLabels(createTaskDto.labels);
    }
    return await this.taskRepository.save(createTaskDto);
  }

  public async updateTask(
    task: Task,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    if (
      updateTaskDto.status &&
      !this.isValidStatusTransition(task.status, updateTaskDto.status)
    ) {
      throw new WrongTaskStatusException();
    }
    if (updateTaskDto.labels) {
      // Ensure labels are unique by name
      updateTaskDto.labels = this.getUniqueLabels(updateTaskDto.labels);
    }

    Object.assign(task, updateTaskDto);
    return await this.taskRepository.save(task);
  }

  private isValidStatusTransition(
    currentStatus: TaskStatus,
    newStatus: TaskStatus,
  ): boolean {
    const statusOrder: TaskStatus[] = [
      TaskStatus.OPEN,
      TaskStatus.IN_PROGRESS,
      TaskStatus.DONE,
    ];
    console.log(
      `Checking status transition from ${currentStatus} to ${newStatus}. ${statusOrder.indexOf(newStatus)} <= ${statusOrder.indexOf(currentStatus)}`,
    );

    return statusOrder.indexOf(currentStatus) <= statusOrder.indexOf(newStatus);
  }

  public async deleteTask(task: Task): Promise<void> {
    //await this.taskRepository.delete(task); // Error: Cannot query across one-to-many for property labels

    // Use remove to handle the one-to-many relationship properly
    // This will also handle the deletion of labels due to orphanedRowAction
    // await this.taskRepository.delete(task.id);
    await this.taskRepository.remove(task);
  }

  public async addLabels(
    task: Task,
    labelDtos: CreateTaskLabelDto[],
  ): Promise<Task> {
    const names = new Set(task.labels.map((label) => label.name));
    const labels = this.getUniqueLabels(labelDtos)
      .filter((dto) => !names.has(dto.name))
      .map((label) => this.labelsRepository.create(label));

    if (labels.length) {
      task.labels = [...task.labels, ...labels];
      return await this.taskRepository.save(task);
    }
    return task;
  }

  private getUniqueLabels(
    labelDtos: CreateTaskLabelDto[],
  ): CreateTaskLabelDto[] {
    const uniqueNames = [...new Set(labelDtos.map((label) => label.name))];
    return uniqueNames.map((name) => ({ name }));
  }

  public async removeLabels(
    task: Task,
    labelsToRemove: string[],
  ): Promise<Task> {
    task.labels = task.labels.filter(
      (label) => !labelsToRemove.includes(label.name),
    );
    return await this.taskRepository.save(task);
  }
}
