import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskStatus } from './tasks.model';
import { User } from './../users/user.entity';
import { TaskLabel } from './task-label.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: false,
    nullable: false, // Title cannot be null
    default: '', // Default value if not provided
  })
  title: string;

  @Column({
    type: 'text',
    nullable: false, // Description cannot be null
    default: '', // Default value if not provided
  })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING, // Default status is PENDING
    nullable: false, // Status cannot be null
  })
  status: TaskStatus;

  @Column({
    type: 'uuid',
    nullable: false, // userId cannot be null
  })
  userId: string;

  @ManyToOne(() => User, (user) => user.tasks, { nullable: false })
  user: User;

  @OneToMany(() => TaskLabel, (label) => label.task, {
    cascade: true,
    orphanedRowAction: 'delete', // Automatically delete labels when the task is deleted
  })
  labels: TaskLabel[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
