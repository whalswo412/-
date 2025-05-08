# Stage 1: 빌더 이미지
FROM node:20-alpine AS builder
WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm ci --only=production

# 소스 복사 및 빌드
COPY . .
RUN npm run build

# Stage 2: 프로덕션 이미지
FROM node:20-alpine AS production
WORKDIR /app

# 빌드 결과와 의존성만 복사
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY crypto-polyfill.js ./crypto-polyfill.js

# 환경 변수 설정
ENV NODE_ENV=production
ENV PORT=8080

# 앱 포트 오픈
EXPOSE 8080

# 서버 실행 (crypto polyfill preload)
CMD ["node", "-r", "./crypto-polyfill.js", "dist/main.js"] 