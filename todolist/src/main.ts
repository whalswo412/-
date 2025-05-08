import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { runSeeds } from './database/seeds';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정 추가
  app.enableCors({
    origin: 'http://localhost:3000', // 프론트엔드 주소
    credentials: true, // 중요: 쿠키 전송 허용
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // 쿠키 파서 미들웨어 추가
  app.use(cookieParser());

  // 개발 환경에서만 DB 시드 실행
  if (process.env.NODE_ENV !== 'production') {
    const dataSource = app.get(DataSource);
    await runSeeds(dataSource);
  }

  app.useGlobalPipes(
    new ValidationPipe({
    /**
       * whitelist: DTO에 없는 속성은 무조건 거른다.
       * forbidNonWhitelisted: 전달하는 요청 값 중에 정의 되지 않은 값이 있으면 Error를 발생합니다.
       * transform: 네트워크를 통해 들어오는 데이터는 일반 JavaScript 객체입니다.
       *            객체를 자동으로 DTO로 변환을 원하면 transform 값을 true로 설정한다.
       * disableErrorMessages: Error가 발생 했을 때 Error Message를 표시 여부 설정(true: 표시하지 않음, false: 표시함)
       *                       배포 환경에서는 true로 설정하는 걸 추천합니다.
       */
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    disableErrorMessages: true,
  })
);

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('TodoList API')
    .setDescription('할 일 관리 API 문서')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'Authorization',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
