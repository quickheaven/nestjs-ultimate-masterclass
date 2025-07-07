import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './tasks.model';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true, // Ensures that each task title is unique
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
}
