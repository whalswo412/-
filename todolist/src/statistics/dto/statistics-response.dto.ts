// src/statistics/dto/statistics-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

/**
 * 사용자별 통계 응답 DTO
 */
export class StatisticsResponseDto {
  @ApiProperty({ description: '전체 작업 개수', example: 12 })
  totalTasks: number;

  @ApiProperty({ description: '전체 태그 개수', example: 7 })
  totalTags: number;

  @ApiProperty({
    description: '상태별 작업 개수',
    type: 'object',
    additionalProperties: { type: 'number' },
    example: { pending: 5, completed: 4, overdue: 3 },
  })
  tasksByStatus: Record<'pending' | 'completed' | 'overdue', number>;

  @ApiProperty({
    description: '우선순위별 작업 개수',
    type: 'object',
    additionalProperties: { type: 'number' },
    example: { low: 2, medium: 6, high: 4 },
  })
  tasksByPriority: Record<'low' | 'medium' | 'high', number>;

  @ApiProperty({
    description: '태그별 작업 개수',
    type: 'object',
    additionalProperties: { type: 'number' },
    example: { 업무: 3, 개인: 5, 긴급: 4 },
  })
  tasksByTag: Record<string, number>;
}