# 1. Node.js 이미지에서 앱 빌드 시작
FROM node:20-alpine AS builder

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 의존성 파일 복사 (package.json 등)
COPY package*.json ./

# 4. 의존성 설치
RUN npm install

# 5. 소스 전체 복사
COPY . .

# 6. React 앱 빌드 (배포용 정적파일 생성)
RUN npm run build

# 7. 빌드 결과물을 Nginx에서 서빙할 거임
FROM nginx:alpine

# 8. 빌드된 정적 파일을 Nginx 기본 경로로 복사
COPY --from=builder /app/build /usr/share/nginx/html

# 9. 80번 포트 열기
EXPOSE 80

# 10. Nginx 실행 명령어
CMD ["nginx", "-g", "daemon off;"]