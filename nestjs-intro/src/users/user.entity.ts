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
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Task, (task) => task.user, {})
  tasks: Task[];
}
