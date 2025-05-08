import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '../../entities/task.entity';

export class UpdateTaskDto {
    @ApiPropertyOptional({ description: '우선순위', enum: TaskPriority, example: TaskPriority.MEDIUM })
    @IsOptional()
    @IsEnum(TaskPriority)
    priority?: TaskPriority;

    @ApiPropertyOptional({ description: '상태', enum: TaskStatus, example: TaskStatus.PENDING })
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @ApiPropertyOptional({ description: '제목', example: '보고서 수정하기' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ description: '설명', example: '주간 보고서 수정' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ description: '마감일 (ISO 문자열)', example: '2025-04-15T00:00:00.000Z' })
    @IsOptional()
    @IsString()
    dueDate?: string;  
}

