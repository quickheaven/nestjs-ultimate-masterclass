import { Expose } from 'class-transformer';
import { Task } from '../tasks/task.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  email: string;

  @Column({ nullable: true })
  password: string;

  @CreateDateColumn()
  @Expose()
  createdAt: Date;

  @CreateDateColumn()
  @Expose()
  updatedAt: Date;

  @OneToMany(() => Task, (task) => task.user, {})
  @Expose()
  tasks: Task[];
}
