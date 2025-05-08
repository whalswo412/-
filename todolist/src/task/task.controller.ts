import { Body, Controller, Delete, Get, Param, Logger, Post, Req, UnauthorizedException, ParseIntPipe, Patch, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TagService } from '../tag/tag.service';
import { UpdateTaskTagsDto } from '../tag/dto/update-task-tags.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * Task 관련 HTTP 요청을 처리하는 컨트롤러
 * 모든 엔드포인트는 JWT 인증이 필요합니다.
 */
@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  private readonly logger = new Logger(TaskController.name);
  
  constructor(
    private readonly taskService: TaskService,
    private readonly tagService: TagService
  ) {}


  @Get('/all')
  async findAll(@Req() req): Promise<TaskResponseDto[]> {
    this.logger.log(`[findAll] 요청: user=${JSON.stringify(req.user)}`);
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      this.logger.error('[findAll] 인증 실패: req.user=' + JSON.stringify(req.user));
      throw new UnauthorizedException('올바른 인증 정보가 없습니다');
    }
    return this.taskService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<TaskResponseDto> {
    this.logger.log(`[findOne] 요청: id=${id}, user=${JSON.stringify(req.user)}`);
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      this.logger.error('[findOne] 인증 실패: req.user=' + JSON.stringify(req.user));
      throw new UnauthorizedException('올바른 인증 정보가 없습니다');
    }
    return this.taskService.findOne(id, userId);
  }
  /**
   * 새 작업 생성
   * POST /tasks
   * @param req 요청 객체 (JWT에서 추출한 사용자 정보 포함)
   * @param createTaskDto 작업 생성 정보
   * @returns 생성된 작업 정보
   */
  @Post()
  async createTask(
    @Req() req,
    @Body() createTaskDto: CreateTaskDto
  ): Promise<TaskResponseDto> {
    this.logger.log(`[createTask] 요청: user=${JSON.stringify(req.user)}, body=${JSON.stringify(createTaskDto)}`);
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      this.logger.error('[createTask] 인증 실패: req.user=' + JSON.stringify(req.user));
      throw new UnauthorizedException('올바른 인증 정보가 없습니다');
    }
    this.logger.log(`작업 생성 요청: 사용자 ${userId}`);
    return this.taskService.createTask(userId, createTaskDto);
  }

  @Patch(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() updateTaskDto: UpdateTaskDto
  ): Promise<TaskResponseDto> {
    this.logger.log(`[updateTask] 요청: id=${id}, user=${JSON.stringify(req.user)}, body=${JSON.stringify(updateTaskDto)}`);
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      this.logger.error('[updateTask] 인증 실패: req.user=' + JSON.stringify(req.user));
      throw new UnauthorizedException('올바른 인증 정보가 없습니다');
    }

    return this.taskService.updateTask(id, userId, updateTaskDto);
  }

  @Delete(':id')    
  deleteTask(@Param("id", ParseIntPipe) id: number, @Req() req): Promise<any> {
    this.logger.log(`[deleteTask] 요청: id=${id}, user=${JSON.stringify(req.user)}`);
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      this.logger.error('[deleteTask] 인증 실패: req.user=' + JSON.stringify(req.user));
      throw new UnauthorizedException('올바른 인증 정보가 없습니다');
    }
    
    return this.taskService.deleteTask(id, userId);
  }

  /**
   * 작업에 태그 업데이트
   * PUT /tasks/:id/tags
   */
  @Put(':id/tags')
  updateTaskTags(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() updateDto: UpdateTaskTagsDto
  ): Promise<any> {
    this.logger.log(`[updateTaskTags] 요청: id=${id}, user=${JSON.stringify(req.user)}, body=${JSON.stringify(updateDto)}`);
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      this.logger.error('[updateTaskTags] 인증 실패: req.user=' + JSON.stringify(req.user));
      throw new UnauthorizedException('올바른 인증 정보가 없습니다');
    }

    return this.tagService.updateTaskTags(id, userId, updateDto);
  }
}
