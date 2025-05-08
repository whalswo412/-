import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';
import { Tag } from './tag.entity';
/**
 * 작업 우선순위 열거형
 * @enum {string}
 */
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

/**
 * 작업 상태 열거형
 * @enum {string}
 */
export enum TaskStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  OVERDUE = 'overdue'
}

/**
 * Task 엔티티 - 할 일 작업 정보를 저장합니다.
 * 
 * @property {number} id - 작업의 고유 식별자
 * @property {number} userId - 작업을 소유한 사용자의 ID (외래 키)
 * @property {string} title - 작업의 제목
 * @property {string} description - 작업의 설명 (선택 사항)
 * @property {TaskPriority} priority - 작업의 우선순위 (낮음, 중간, 높음)
 * @property {Date} dueDate - 작업의 마감일 (선택 사항)
 * @property {TaskStatus} status - 작업의 상태 (대기 중, 완료됨, 기한 초과)
 * @property {Date} createdAt - 작업 생성 시간
 * @property {Date} updatedAt - 작업 마지막 업데이트 시간
 * @property {User} user - 작업을 소유한 사용자 (다대일 관계)
 * @property {Tag[]} tags - 작업에 할당된 태그 목록 (다대다 관계)
 */
@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM
  })
  priority: TaskPriority;

  @Column({ name: 'due_date', nullable: true })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING
  })
  status: TaskStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // 작업과 사용자 간의 다대일 관계 설정
  @ManyToOne(() => User, user => user.tasks)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // 작업과 태그 간의 다대다 관계 설정
  @ManyToMany(() => Tag, tag => tag.tasks)
  @JoinTable({
    name: 'Task_Tag', // 중간 테이블 이름
    joinColumn: {
      name: 'task_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id'
    }
  })
  tags: Tag[];
}