import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TagRepository } from './repositories/tag.repository';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagResponseDto } from './dto/tag-response.dto';
import { Tag } from '../entities/tag.entity';
import { UpdateTaskTagsDto } from './dto/update-task-tags.dto';
import { TaskRepository } from '../task/repositories/task.repository';

@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name);
  
  constructor(
    private tagRepository: TagRepository,
    private taskRepository: TaskRepository
  ) {}

  /**
   * 사용자의 태그 목록 조회 (시스템 태그 + 사용자 태그)
   */
  async findAllTags(userId: number): Promise<TagResponseDto[]> {
    try {
      const tags = await this.tagRepository.findAll(userId);
      return tags.map(tag => this.mapTagToDto(tag));
    } catch (error) {
      this.logger.error(`태그 목록 조회 중 오류: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 시스템 태그만 조회
   */
  async findSystemTags(): Promise<TagResponseDto[]> {
    try {
      const systemTags = await this.tagRepository.findSystemTags();
      return systemTags.map(tag => this.mapTagToDto(tag));
    } catch (error) {
      this.logger.error(`시스템 태그 조회 중 오류: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 새 태그 생성
   */
  async createTag(userId: number, createTagDto: CreateTagDto): Promise<TagResponseDto> {
    try {
      // 이미 존재하는 태그인지 확인
      const existingTag = await this.tagRepository.findByName(createTagDto.name);
      if (existingTag) {
        if (existingTag.isSystemTag || existingTag.userId === userId) {
          throw new BadRequestException(`'${createTagDto.name}' 태그가 이미 존재합니다`);
        }
      }
      
      const tag = await this.tagRepository.create(userId, createTagDto);
      return this.mapTagToDto(tag);
    } catch (error) {
      this.logger.error(`태그 생성 중 오류: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 태그 삭제 (사용자 태그만 가능)
   */
  async deleteTag(id: number, userId: number): Promise<{ success: boolean; message: string }> {
    try {
      await this.tagRepository.remove(id, userId);
      return {
        success: true,
        message: '태그가 성공적으로 삭제되었습니다'
      };
    } catch (error) {
      this.logger.error(`태그 삭제 중 오류: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 작업에 태그 추가/업데이트
   */
  async updateTaskTags(taskId: number, userId: number, updateDto: UpdateTaskTagsDto): Promise<any> {
    try {
      // 1. 작업 조회 및 소유권 확인
      const task = await this.taskRepository.findByIdAndUserId(taskId, userId);
      if (!task) {
        throw new NotFoundException(`작업을 찾을 수 없습니다`);
      }
      
      // 2. 태그 처리
      const tags: Tag[] = [];
      
      // 기존 태그 처리
      if (updateDto.tagIds && updateDto.tagIds.length > 0) {
        const existingTags = await this.tagRepository.findByIds(updateDto.tagIds);
        tags.push(...existingTags);
      }
      
      // 새 태그 처리
      if (updateDto.newTags && updateDto.newTags.length > 0) {
        const newTags = await this.tagRepository.findOrCreateTags(userId, updateDto.newTags);
        tags.push(...newTags);
      }
      
      // 3. 태그 업데이트
      task.tags = tags;
      const updatedTask = await this.taskRepository.updateWithTags(task, {}, tags);
      
      // 4. 응답 데이터 생성
      return {
        id: updatedTask.id,
        title: updatedTask.title,
        tags: updatedTask.tags.map(tag => ({
          id: tag.id,
          name: tag.name
        }))
      };
    } catch (error) {
      this.logger.error(`작업 태그 업데이트 중 오류: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 태그 엔티티를 DTO로 변환
   */
  private mapTagToDto(tag: Tag): TagResponseDto {
    return {
      id: tag.id,
      name: tag.name,
      isSystemTag: tag.isSystemTag,
      userId: tag.isSystemTag ? undefined : tag.userId,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt
    };
  }
}