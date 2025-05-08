import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Statistics {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @Column({ name: 'total_completed_tasks', default: 0 })
  totalCompletedTasks: number;

  @Column({ name: 'total_pending_tasks', default: 0 })
  totalPendingTasks: number;

  @Column({ name: 'total_overdue_tasks', default: 0 })
  totalOverdueTasks: number;

  @Column({
    name: 'priority_distribution',
    type: 'json',
    nullable: true // DEFAULT 값 대신 nullable 사용
  })
  priorityDistribution: {
    low: number;
    medium: number;
    high: number;
  };

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // 생성 전에 priorityDistribution 초기화
  @BeforeInsert()
  initializePriorityDistribution() {
    if (!this.priorityDistribution) {
      this.priorityDistribution = { low: 0, medium: 0, high: 0 };
    }
  }

  // 통계와 사용자 간의 일대일 관계 설정
  @OneToOne(() => User, user => user.statistics)
  @JoinColumn({ name: 'user_id' })
  user: User;
}