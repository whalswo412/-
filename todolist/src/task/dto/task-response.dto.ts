import { TaskPriority, TaskStatus } from '../../entities/task.entity';
import { ApiProperty } from '@nestjs/swagger';

export class TaskResponseDto {
  @ApiProperty({ example: 1, description: '작업 고유 ID' })
  id: number;
  @ApiProperty({ example: '보고서 작성하기', description: '작업 제목' })
  title: string;
  @ApiProperty({ example: '주간 업무 보고서 작성', description: '작업 설명', required: false })
  description?: string;
  @ApiProperty({ example: 'medium', description: '우선순위', enum: TaskPriority })
  priority: TaskPriority;
  @ApiProperty({ example: '2025-04-10T00:00:00.000Z', description: '마감일', required: false })
  dueDate?: Date;
  @ApiProperty({ example: 'pending', description: '작업 상태', enum: TaskStatus })
  status: TaskStatus;
  @ApiProperty({ example: '2025-05-04T02:30:00.000Z', description: '생성일시' })
  createdAt: Date;
  @ApiProperty({ example: '2025-05-04T02:30:00.000Z', description: '수정일시' })
  updatedAt: Date;
  @ApiProperty({ example: 1, description: '해당 작업을 생성한 사용자 ID' })
  userId: number;
  @ApiProperty({ description: '연결된 태그 목록', type: [Object], required: false, example: [{ id: 2, name: '업무' }] })
  tags?: {
    id: number;
    name: string;
  }[];
}