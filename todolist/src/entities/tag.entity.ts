import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Task } from './task.entity';
import { User } from './user.entity';


const systemTags = [
  { name: '업무', isSystemTag: true },
  { name: '개인', isSystemTag: true },
  { name: '긴급', isSystemTag: true },
  { name: '학습', isSystemTag: true },
  { name: '가족', isSystemTag: true },
  { name: '재정', isSystemTag: true },
  { name: '건강', isSystemTag: true },
  { name: '취미', isSystemTag: true }
];

/**
 * Tag 엔티티 - 작업을 분류하는 태그 정보를 저장합니다.
 * 
 * @property {number} id - 태그의 고유 식별자
 * @property {string} name - 태그 이름 (유일한 값)
 * @property {Date} createdAt - 태그 생성 시간
 * @property {Date} updatedAt - 태그 마지막 업데이트 시간
 * @property {Task[]} tasks - 이 태그가 할당된 작업 목록 (다대다 관계)
 */
@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
  
  @Column({ default: false })
  isSystemTag: boolean; // 시스템 기본 태그 여부
  
  @Column({ nullable: true })
  userId: number; // 사용자 정의 태그인 경우 소유자
  
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;
  
  @ManyToMany(() => Task)
  tasks: Task[];
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
}