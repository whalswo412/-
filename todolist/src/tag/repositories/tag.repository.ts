import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, In, Repository } from "typeorm";
import { Tag } from "../../entities/tag.entity";
import { CreateTagDto } from "../dto/create-tag.dto";

@Injectable()
export class TagRepository {
  private repository: Repository<Tag>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Tag);
  }

  /**
   * 모든 태그 조회 (시스템 태그 + 사용자 태그)
   */
  async findAll(userId: number): Promise<Tag[]> {
    return this.repository.find({
      where: [
        { isSystemTag: true },
        { userId }
      ],
      order: { name: 'ASC' }
    });
  }

  /**
   * 시스템 태그만 조회
   */
  async findSystemTags(): Promise<Tag[]> {
    return this.repository.find({
      where: { isSystemTag: true },
      order: { name: 'ASC' }
    });
  }

  /**
   * ID로 태그 조회
   */
  async findById(id: number): Promise<Tag> {
    const tag = await this.repository.findOne({ where: { id } });
    if (!tag) {
      throw new NotFoundException(`ID가 ${id}인 태그를 찾을 수 없습니다`);
    }
    return tag;
  }

  /**
   * ID 배열로 여러 태그 조회
   */
  async findByIds(ids: number[]): Promise<Tag[]> {
    return this.repository.find({
      where: { id: In(ids) }
    });
  }

  /**
   * 태그명으로 태그 조회
   */
  async findByName(name: string): Promise<Tag | null> {
    return this.repository.findOne({ where: { name } });
  }

  /**
   * 새 태그 생성
   */
  async create(userId: number, createTagDto: CreateTagDto): Promise<Tag> {
    const tag = this.repository.create({
      ...createTagDto,
      userId,
      isSystemTag: false
    });
    return this.repository.save(tag);
  }

  /**
   * 태그 삭제 (사용자 태그만 가능)
   */
  async remove(id: number, userId: number): Promise<void> {
    const tag = await this.repository.findOne({
      where: { id, userId, isSystemTag: false }
    });
    
    if (!tag) {
      throw new NotFoundException('삭제할 수 있는 태그가 없습니다. 시스템 태그는 삭제할 수 없습니다.');
    }
    
    await this.repository.remove(tag);
  }

  /**
   * 새 태그 추가 또는 기존 태그 찾기
   */
  async findOrCreateTags(userId: number, tagNames: string[]): Promise<Tag[]> {
    const tags: Tag[] = [];
    
    for (const name of tagNames) {
      // 기존 태그 찾기 (시스템 태그 또는 사용자 태그)
      let tag = await this.repository.findOne({
        where: [
          { name, isSystemTag: true },
          { name, userId }
        ]
      });
      
      // 없으면 새로 생성
      if (!tag) {
        tag = this.repository.create({
          name,
          userId,
          isSystemTag: false
        });
        tag = await this.repository.save(tag);
      }
      
      tags.push(tag);
    }
    
    return tags;
  }
}