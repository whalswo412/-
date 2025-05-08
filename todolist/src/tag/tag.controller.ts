import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagResponseDto } from './dto/tag-response.dto';
import { UpdateTaskTagsDto } from './dto/update-task-tags.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Tags')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  /**
   * 태그 목록 조회 (시스템 태그 + 사용자 태그)
   * GET /tags
   */
  @Get()
  findAllTags(@Req() req): Promise<TagResponseDto[]> {
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException('올바른 인증 정보가 없습니다');
    }
    return this.tagService.findAllTags(userId);
  }

  /**
   * 시스템 태그만 조회
   * GET /tags/system
   */
  @Get('system')
  findSystemTags(@Req() req): Promise<TagResponseDto[]> {
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException('올바른 인증 정보가 없습니다');
    }
    return this.tagService.findSystemTags();
  }

  /**
   * 새 태그 생성
   * POST /tags
   */
  @Post()
  createTag(@Req() req, @Body() createTagDto: CreateTagDto): Promise<TagResponseDto> {
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException('올바른 인증 정보가 없습니다');
    }
    return this.tagService.createTag(userId, createTagDto);
  }

  /**
   * 태그 삭제
   * DELETE /tags/:id
   */
  @Delete(':id')
  deleteTag(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<any> {
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException('올바른 인증 정보가 없습니다');
    }
    return this.tagService.deleteTag(id, userId);
  }
}