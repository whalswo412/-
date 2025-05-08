import { IsNotEmpty, IsString, IsOptional, IsEnum, IsDateString, IsArray, IsNumber } from 'class-validator';
import { TaskPriority, TaskStatus } from '../../entities/task.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ description: '할 일 제목', example: '보고서 작성하기' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: '할 일 설명', example: '주간 업무 보고서 작성' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: '우선순위', enum: TaskPriority, example: TaskPriority.MEDIUM })
  @IsNotEmpty()
  @IsEnum(TaskPriority)
  priority: TaskPriority = TaskPriority.MEDIUM;

  @ApiProperty({ description: '마감일 (ISO 문자열)', required: false, example: '2025-04-10T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ description: '상태', enum: TaskStatus, example: TaskStatus.PENDING })
  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus = TaskStatus.PENDING;

  @ApiProperty({ description: '기존 태그 ID 배열', required: false, example: [2, 3] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  tagIds?: number[];

  @ApiProperty({ description: '새로 생성할 태그 이름 배열', required: false, example: ["보고서", "주간"] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  newTags?: string[];
}