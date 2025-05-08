import { ApiProperty } from '@nestjs/swagger';

export class TagResponseDto {
    @ApiProperty({ example: 1, description: '태그 고유 ID' })
    id: number;
    @ApiProperty({ example: '업무', description: '태그 이름' })
    name: string;
    @ApiProperty({ example: true, description: '시스템 기본 태그 여부' })
    isSystemTag: boolean;
    @ApiProperty({ example: 1, description: '사용자 ID (사용자 정의 태그인 경우)', required: false })
    userId?: number;
    @ApiProperty({ example: '2025-05-04T02:00:00.000Z', description: '생성일시', required: false })
    createdAt?: Date;
    @ApiProperty({ example: '2025-05-04T02:00:00.000Z', description: '수정일시', required: false })
    updatedAt?: Date;
  }