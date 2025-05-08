# NestJS 할 일 관리 애플리케이션

NestJS로 구현된 할 일 관리(Todo) 애플리케이션입니다. 사용자 인증, 할 일 작업 관리, 태그 기능을 제공합니다.

## 주요 기능

- **사용자 인증**: JWT 인증을 통한 안전한 사용자 인증
- **할 일 관리**: 할 일 생성, 조회, 수정, 삭제 기능
- **태그 기능**: 할 일에 태그 추가 및 관리
- **시스템 태그**: 기본 제공되는 시스템 태그 (업무, 개인, 긴급 등)

## 기술 스택

- **Backend**: NestJS, TypeORM
- **Database**: MySQL
- **Authentication**: JWT, Passport.js

## API 엔드포인트

### 할 일 (Tasks)

- `GET /tasks`: 사용자의 모든 할 일 조회
- `POST /tasks`: 새 할 일 생성
- `PATCH /tasks/:id`: 할 일 정보 수정
- `DELETE /tasks/:id`: 할 일 삭제
- `PUT /tasks/:id/tags`: 할 일에 태그 추가/수정

### 태그 (Tags)

- `GET /tags`: 모든 태그 조회
- `GET /tags/system`: 시스템 태그 조회
- `POST /tags`: 새 태그 생성
- `DELETE /tags/:id`: 태그 삭제

## 할 일 생성 시 태그 사용법

할 일 생성 시 태그를 함께 지정할 수 있습니다:

```json
{
  "title": "보고서 작성하기",
  "description": "주간 업무 보고서 작성",
  "status": "pending",
  "priority": "high",
  "tagIds": [2, 3],      // 기존 태그 ID
  "newTags": ["보고서", "주간"]  // 새로 생성할 태그
}
```

## 데이터 모델

### Task

- `id`: number (PK)
- `userId`: number (FK)
- `title`: string
- `description`: string
- `priority`: enum('low', 'medium', 'high')
- `status`: enum('pending', 'completed', 'overdue')
- `dueDate`: Date
- `createdAt`: Date
- `updatedAt`: Date

### Tag

- `id`: number (PK)
- `name`: string
- `isSystemTag`: boolean
- `userId`: number (FK, nullable)
- `createdAt`: Date
- `updatedAt`: Date

## 시작하기

1. 저장소 클론
```bash
git clone https://github.com/whalswo412/Todolist.git
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
```bash
# .env 파일 생성
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=yourpassword
DB_DATABASE=todolist
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION_TIME=3600
```

4. 애플리케이션 실행
```bash
npm run start:dev
```

5. 시드 데이터 초기화 (시스템 태그 생성)
```bash
npx ts-node src/database/seed.ts
```

## Docker로 실행하기

Docker와 Docker Compose를 사용해 애플리케이션과 DB를 함께 배포하고 실행할 수 있습니다.

1. 환경 변수 설정
   `.env` 파일을 작성하거나 환경 변수를 설정합니다:
   ```bash
   DB_HOST=db
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=yourpassword
   DB_DATABASE=todolist
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION=3600
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   ```
2. 컨테이너 빌드 및 실행
   ```bash
   docker-compose up --build -d
   ```
3. 로그 확인
   ```bash
   docker-compose logs -f
   ```
4. 중지 및 재시작
   ```bash
   docker-compose stop
   docker-compose start
   ```
5. 데이터 초기화(볼륨 삭제)
   ```bash
   docker-compose down -v
   ```
