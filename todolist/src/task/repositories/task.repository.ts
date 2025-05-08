import { Injectable, NotFoundException } from "@nestjs/common";
import { Task, TaskPriority, TaskStatus } from "../../entities/task.entity";
import { DataSource, Repository } from "typeorm";
import { UpdateTaskDto } from "../dto/update-task.dto";

/**
 * Task 엔티티에 대한 데이터 액세스를 처리하는 레포지토리
 */
@Injectable()
export class TaskRepository {
    private repository: Repository<Task>;

    constructor(private dataSource: DataSource) {
        this.repository = this.dataSource.getRepository(Task);
    }

    /**
     * 사용자의 모든 작업 조회
     * @param userId 사용자 ID
     * @returns 작업 목록
     */
    async findAllByUserId(userId: number): Promise<Task[]> {
        console.log(`[findAllByUserId] userId=${userId}`);
        const result = await this.repository.find({
            where: { userId },
            relations: ['tags'],
            order: { createdAt: 'DESC' }
        });
        console.log(`[findAllByUserId] 결과: ${result.length}건 반환`);
        return result;
    }

    /**
     * 특정 작업 조회
     * @param id 작업 ID
     * @param userId 사용자 ID
     * @returns 작업 정보
     */
    async findByIdAndUserId(id: number, userId: number): Promise<Task | null> {
        console.log(`[findByIdAndUserId] id=${id}, userId=${userId}`);
        const result = await this.repository.findOne({
            where: { id, userId },
            relations: ['tags']
        });
        console.log(`[findByIdAndUserId] 결과: ${result ? '존재' : '없음'}`);
        return result;
    }

    /**
     * 새 작업을 생성하고 태그를 연결합니다
     * @param createTaskData 생성할 작업 데이터 (userId 필수)
     * @param tags 연결할 태그 객체 배열
     * @returns 저장된 작업 엔티티
     */
    async createWithTags(createTaskData: Partial<Task>, tags: any[] = []): Promise<Task> {
        // userId 필수 검증
        if (!createTaskData.userId) {
            console.error('[createWithTags] userId 누락:', createTaskData);
            throw new Error('작업 생성에 사용자 ID가 필요합니다');
        }
        console.log('[createWithTags] 저장할 작업 데이터:', createTaskData, 'tags:', tags.map(t => t.name));
        // Task 엔티티 생성
        const task = this.repository.create(createTaskData);
        // 태그 연결
        if (tags && tags.length > 0) {
            task.tags = tags;
        }
        // 데이터베이스에 저장
        const saved = await this.repository.save(task);
        console.log(`[createWithTags] 저장 완료: id=${saved.id}`);
        return saved;
    }
    
    /**
     * 작업 상태/우선순위 업데이트
     * @param id 작업 ID
     * @param userId 사용자 ID
     * @param updateData 업데이트할 데이터 (status, priority만 포함)
     * @returns 업데이트된 작업
     */
    async updateStatusAndPriority(id: number, userId: number, updateData: UpdateTaskDto): Promise<Task> {
        console.log(`[updateStatusAndPriority] id=${id}, userId=${userId}, updateData=${JSON.stringify(updateData)}`);
        // 1. 작업 조회
        const task = await this.findByIdAndUserId(id, userId);
        if (!task) {
            console.warn(`[updateStatusAndPriority] 작업 없음: id=${id}, userId=${userId}`);
            throw new NotFoundException('작업을 찾을 수 없습니다');
        }
        // 2. 허용된 필드만 업데이트
        if (updateData.status) {
            task.status = updateData.status;
        }
        if (updateData.priority) {
            task.priority = updateData.priority;
        }
        if (updateData.title) {
            task.title = updateData.title;
        }
        if (updateData.description) {
            task.description = updateData.description;
        }
        if (updateData.dueDate) {
            task.dueDate = new Date(updateData.dueDate);
        }
        // 3. 데이터베이스에 저장
        const saved = await this.repository.save(task);
        console.log(`[updateStatusAndPriority] 저장 완료: id=${saved.id}`);
        return saved;
    }

    /**
     * 작업 업데이트
     * @param task 업데이트할 작업 엔티티
     * @param updateData 업데이트 데이터
     * @param tags 연결할 태그 배열
     * @returns 업데이트된 작업
     */
    async updateWithTags(
        task: Task, 
        updateData: Partial<Task>,
        tags?: any[]
    ): Promise<Task> {
        // 데이터 업데이트
        Object.assign(task, updateData);
        
        // 태그 업데이트
        if (tags) {
            task.tags = tags;
        }
        
        return this.repository.save(task);
    }
    
    /**
     * 작업 삭제
     * @param task 삭제할 작업 엔티티
     */
    async remove(task: Task): Promise<Task> {
        console.log(`[remove] id=${task.id}, userId=${task.userId}`);
        const removed = await this.repository.remove(task);
        console.log(`[remove] 삭제 완료: id=${task.id}`);
        return removed;
    }
}