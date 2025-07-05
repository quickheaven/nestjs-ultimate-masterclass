import { Controller, Get, Param } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
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
