# # 빌드 단계
# FROM node:20-alpine AS builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # 실행 단계
# FROM node:20-alpine
# WORKDIR /app
# COPY --from=builder /app/package*.json ./
# RUN npm install --production
# COPY --from=builder /app/.next ./.next
# # COPY --from=builder /app/public ./public
# EXPOSE 3000
# CMD ["node_modules/.bin/next", "start"]


# FROM node:20

# RUN mkdir -p /app
# WORKDIR /app
# ADD . /app/

# RUN npm install
# RUN npm run build

# ENV HOST 0.0.0.0
# EXPOSE 3000

# CMD [ "npm", "start"]


# FROM node:20-alpine

# Node Stable 18.16.0 경량화(alpine) 버전
FROM node:20-alpine
ENV NODE_ENV=production
# 디렉토리 생성
RUN mkdir -p /app
# 디렉토리 지정
WORKDIR /app

# 의존성 설치
# package.json, yarn.lock 복사
COPY package*.json ./

# 패키지 설치
RUN npm install

# 필요한 모든 파일을 복사
COPY . .

# 프로젝트 빌드
RUN npm run build

# 컨테이너 포트 3000 설정
EXPOSE 3000

# 실행
CMD [ "npm", "start"]
