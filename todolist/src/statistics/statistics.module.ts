import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { TaskModule } from '../task/task.module';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [TaskModule, TagModule],
  controllers: [StatisticsController],
  providers: [StatisticsService]
})
export class StatisticsModule {}
