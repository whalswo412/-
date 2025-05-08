# To-Do 리스트 애플리케이션

이 레포지토리는 할 일 관리를 위한 웹 애플리케이션을 포함하고 있습니다. 프론트엔드와 백엔드로 구성되어 있습니다.

## 프로젝트 구조

- `frontend/`: Next.js 기반의 프론트엔드 애플리케이션
- `todolist/`: NestJS 기반의 백엔드 API 서버

## 기술 스택

### 프론트엔드 (frontend)
- Next.js
- React
- TypeScript
- Tailwind CSS
- Zustand (상태 관리)
- React Query (데이터 페칭)

### 백엔드 (todolist)
- NestJS
- TypeScript
- TypeORM
- MySQL
- JWT Authentication

## 설치 및 실행 방법

### 프론트엔드

```bash
cd frontend
npm install
npm run dev
```

### 백엔드

```bash
cd todolist
npm install
npm run start:dev
```

## 주요 기능

- 할 일 생성, 조회, 수정, 삭제
- 태그 및 카테고리 관리
- 사용자 인증
- 할 일 목록 필터링 및 정렬

## 환경 설정

각 프로젝트 디렉토리에 적절한 환경 변수 파일(.env)을 생성해야 합니다. 예시는 각 프로젝트의 README를 참조하세요. 