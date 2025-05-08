import { Injectable } from '@nestjs/common';
import { TaskService } from 'src/task/task.service';
import { TagService } from 'src/tag/tag.service';
import { StatisticsResponseDto } from './dto/statistics-response.dto';
@Injectable()
export class StatisticsService {
    constructor(
        private readonly taskService: TaskService,
        private readonly tagService: TagService
    ) {}

    async getUserStatistics(userId: number): Promise<StatisticsResponseDto> {
        const tasks = await this.taskService.findAll(userId);
        const tags = await this.tagService.findAllTags(userId);

        const tasksByStatus: Record<'pending' | 'completed' | 'overdue', number> = {
            pending: 0, completed: 0, overdue: 0,
        };
        const tasksByPriority: Record<'low' | 'medium' | 'high', number> = {
            low: 0, medium: 0, high: 0,
        };
        const tasksByTag: Record<string, number> = {};

        tasks.forEach(task => {
            tasksByStatus[task.status]++;
            tasksByPriority[task.priority]++;
            task.tags?.forEach(tag => {
                tasksByTag[tag.name] = (tasksByTag[tag.name] || 0) + 1;
            });
        });

        return {
            totalTasks: tasks.length,
            totalTags: tags.length,
            tasksByStatus,
            tasksByPriority,
            tasksByTag,
        };
    }

    
}
