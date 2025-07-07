import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])], // Add your entities here if needed
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
