import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateTaskTagsDto {
  @IsOptional()
  @IsArray()
  tagIds?: number[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  newTags?: string[];
}