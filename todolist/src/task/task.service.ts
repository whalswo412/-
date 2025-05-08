import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './repositories/task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from '../entities/task.entity';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TagRepository } from '../tag/repositories/tag.repository';
import { Tag } from '../entities/tag.entity';

/**
 * Task 관련 비즈니스 로직을 처리하는 서비스
 * 이 서비스는 TaskRepository를 사용하여 데이터 액세스를 처리합니다.
 */
@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  
  constructor(
    private taskRepository: TaskRepository,
    private tagRepository: TagRepository
  ) {}

  async findAll(userId: number): Promise<TaskResponseDto[]> {
    this.logger.log(`[findAll] 요청: userId=${userId}`);
    const tasks = await this.taskRepository.findAllByUserId(userId);
    this.logger.debug(`[findAll] 결과: ${tasks.length}건 반환`);
    return tasks.map(this.mapTaskToDto);
  }

  async findOne(id: number, userId: number): Promise<TaskResponseDto> {
    this.logger.log(`[findOne] 요청: id=${id}, userId=${userId}`);
    const task = await this.taskRepository.findByIdAndUserId(id, userId);
    if (!task) {
      this.logger.warn(`[findOne] 작업 없음: id=${id}, userId=${userId}`);
      throw new NotFoundException('작업을 찾을 수 없습니다');
    }
    return this.mapTaskToDto(task);
  }

  /**
   * 새 Task 생성
   * @param userId 사용자 ID - 인증된 사용자의 ID
   * @param createTaskDto 작업 생성에 필요한 데이터 전송 객체
   * @returns 생성된 작업 정보를 포함한 DTO
   */
  async createTask(userId: number, createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
    try {
      this.logger.debug(`작업 생성 시작: 사용자 ID ${userId}`);
      
      // 작업 데이터 준비 - userId를 명시적으로 포함
      const taskData = {
        userId: userId, // 중요: 사용자 ID를 반드시 포함해야 함
        title: createTaskDto.title,
        description: createTaskDto.description,
        priority: createTaskDto.priority,
        status: createTaskDto.status,
        dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : undefined
      };
      
      this.logger.debug(`작업 생성 데이터: ${JSON.stringify(taskData)}`);
      
      // 태그 처리
      const tags: Tag[] = [];
      
      // 기존 태그 처리
      if (createTaskDto.tagIds && createTaskDto.tagIds.length > 0) {
        const existingTags = await this.tagRepository.findByIds(createTaskDto.tagIds);
        tags.push(...existingTags);
      }
      
      // 새 태그 처리
      if (createTaskDto.newTags && createTaskDto.newTags.length > 0) {
        const newTags = await this.tagRepository.findOrCreateTags(userId, createTaskDto.newTags);
        tags.push(...newTags);
      }
      
      // 작업 생성 및 저장 (태그 배열 전달)
      const savedTask = await this.taskRepository.createWithTags(taskData, tags);
      this.logger.log(`사용자 ${userId}의 새 작업 생성 완료: ID ${savedTask.id}`);
      
      return this.mapTaskToDto(savedTask);
    } catch (error) {
      this.logger.error(`작업 생성 중 오류: ${error.message}`, error.stack);
      if (error.code === 'ER_NO_DEFAULT_FOR_FIELD') {
        throw new BadRequestException('작업 생성에 필요한 필수 정보가 누락되었습니다. 사용자 ID가 필요합니다.');
      }
      throw error;
    }
  }

  async updateTask(id: number, userId: number, updateTaskDto: UpdateTaskDto): Promise<TaskResponseDto> {
    this.logger.log(`[updateTask] 요청: id=${id}, userId=${userId}, updateTaskDto=${JSON.stringify(updateTaskDto)}`);
    try {
      // 최소한 하나 이상의 필드가 제공되었는지 검증
      if (Object.keys(updateTaskDto).length === 0 || 
        !Object.values(updateTaskDto).some(value => value !== undefined && value !== null)) {
          this.logger.warn(`[updateTask] 잘못된 요청: updateTaskDto가 비어있음`);
          throw new BadRequestException('최소 하나 이상의 필드를 제공해야 합니다');
      }

      // repository 호출하여 업데이트 - UpdateTaskDto를 직접 전달
      const updatedTask = await this.taskRepository.updateStatusAndPriority(
        id,
        userId,
        updateTaskDto
      );
      this.logger.debug(`[updateTask] 결과: updatedTask.id=${updatedTask.id}`);
      // 응답 DTO로 변환
      return this.mapTaskToDto(updatedTask);
    } catch (error) {
      this.logger.error(`[updateTask] 작업 업데이트 중 오류: ${error.message}`, error.stack);
      throw new InternalServerErrorException('작업 업데이트 중 오류가 발생했습니다');
    }
  }

  async deleteTask(id: number, userId: number): Promise<{ success: boolean; message: string }> {
    this.logger.log(`[deleteTask] 요청: id=${id}, userId=${userId}`);
    try {
      // 1. 작업 조회
      const task = await this.taskRepository.findByIdAndUserId(id, userId);

      if (!task) {
        this.logger.warn(`[deleteTask] 작업 없음: id=${id}, userId=${userId}`);
        throw new NotFoundException('작업을 찾을 수 없습니다');
      }

      // 2. 작업 삭제 - task 객체를 전달
      await this.taskRepository.remove(task);
      this.logger.log(`[deleteTask] 삭제 완료: id=${id}, userId=${userId}`);
      return {
        success: true,
        message: '작업이 성공적으로 삭제되었습니다'
      }
    } catch (error) {
      this.logger.error(`[deleteTask] 작업 삭제 중 오류: ${error.message}`, error.stack);
      throw new InternalServerErrorException('작업 삭제 중 오류가 발생했습니다');
    }
  }

  /**
   * 작업 엔티티를 DTO로 변환
   * 데이터베이스 엔티티를 API 응답 형식으로 변환합니다.
   * @param task 작업 엔티티
   * @returns 클라이언트에 전송할 형식의 DTO
   */
  private mapTaskToDto(task: Task): TaskResponseDto {
    // task가 null이나 undefined인 경우 예외 처리
    if (!task) {
      throw new Error('작업 엔티티가 없습니다');
    }
    
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      userId: task.userId,
      // tags가 없을 경우 빈 배열 반환
      tags: task.tags?.map(tag => ({
        id: tag.id,
        name: tag.name
      })) || []
    };
  }
}