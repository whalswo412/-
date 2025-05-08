import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { Task } from './task.entity';
import { Statistics } from './statistics.entity';

/**
 * User 엔티티 - 사용자 정보를 저장합니다.
 * 일반 로그인 및 소셜 로그인(구글 등) 모두 지원합니다.
 * 
 * @property {number} id - 사용자의 고유 식별자
 * @property {string} email - 사용자의 이메일 주소 (유일한 값)
 * @property {string} password - 사용자의 암호화된 비밀번호 (소셜 로그인 시 null)
 * @property {string} firstName - 사용자의 이름
 * @property {string} lastName - 사용자의 성
 * @property {string} provider - 인증 제공자 (local, google 등)
 * @property {string} providerId - 소셜 로그인 제공자의 사용자 ID
 * @property {Date} createdAt - 사용자 계정 생성 시간
 * @property {Date} updatedAt - 사용자 정보 마지막 업데이트 시간
 */
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @Column({ default: 'local' })
  provider: string;

  @Column({ name: 'provider_id', nullable: true })
  providerId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // 사용자와 작업 간의 일대다 관계 설정
  @OneToMany(() => Task, task => task.user)
  tasks: Task[];

  // 사용자와 통계 간의 일대일 관계 설정
  @OneToOne(() => Statistics, statistics => statistics.user)
  statistics: Statistics;
}