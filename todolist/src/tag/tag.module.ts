import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from '../entities/tag.entity';
import { Task } from '../entities/task.entity';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TagRepository } from './repositories/tag.repository';
import { TaskRepository } from '../task/repositories/task.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag, Task])
  ],
  controllers: [TagController],
  providers: [TagService, TagRepository, TaskRepository],
  exports: [TagService, TagRepository]
})
export class TagModule {}
