import { DataSource } from 'typeorm';
import { createSystemTags } from './tag.seed';

// 시드 데이터 실행 함수
export const runSeeds = async (dataSource: DataSource): Promise<void> => {
  try {
    console.log('시드 데이터 초기화 시작...');
    
    // 시스템 태그 생성
    await createSystemTags(dataSource);
    
    console.log('모든 시드 데이터가 성공적으로 초기화되었습니다!');
  } catch (error) {
    console.error('시드 데이터 초기화 중 오류 발생:', error);
    throw error;
  }
}; 