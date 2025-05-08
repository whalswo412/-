import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { runSeeds } from './seeds';
import { AppModule } from '../app.module';

/**
 * 시드 데이터 스크립트 실행 - 독립 실행형 스크립트로 사용
 * 실행 방법: npx ts-node src/database/seed.ts
 */
async function bootstrap() {
  // NestJS 애플리케이션 생성
  const app = await NestFactory.create(AppModule);

  try {
    // DataSource 가져오기
    const dataSource = app.get(DataSource);
    
    // 시드 데이터 실행
    await runSeeds(dataSource);
    
    console.log('시드 작업이 완료되었습니다.');
  } catch (error) {
    console.error('시드 초기화 중 오류 발생:', error);
  } finally {
    // 애플리케이션 종료
    await app.close();
  }
}

// 스크립트가 직접 실행될 때만 bootstrap 실행
if (require.main === module) {
  bootstrap();
} 