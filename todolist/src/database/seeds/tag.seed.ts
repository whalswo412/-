import { DataSource } from 'typeorm';
import { Tag } from '../../entities/tag.entity';

export const createSystemTags = async (dataSource: DataSource): Promise<void> => {
  const tagRepository = dataSource.getRepository(Tag);

  // 시스템 태그 정의
  const systemTags = [
    { name: '업무', isSystemTag: true },
    { name: '개인', isSystemTag: true },
    { name: '긴급', isSystemTag: true },
    { name: '학습', isSystemTag: true },
    { name: '가족', isSystemTag: true },
    { name: '재정', isSystemTag: true },
    { name: '건강', isSystemTag: true },
    { name: '취미', isSystemTag: true }
  ];

  // 이미 존재하는지 확인 후 없으면 생성
  for (const tagData of systemTags) {
    const existingTag = await tagRepository.findOne({ 
      where: { name: tagData.name, isSystemTag: true }
    });

    if (!existingTag) {
      const tag = tagRepository.create(tagData);
      await tagRepository.save(tag);
      console.log(`시스템 태그 생성: ${tagData.name}`);
    } else {
      console.log(`시스템 태그 이미 존재: ${tagData.name}`);
    }
  }

  console.log('시스템 태그 초기화 완료!');
}; 