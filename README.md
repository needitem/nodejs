# Node.js 수업 프로젝트

이 프로젝트는 Node.js를 사용하여 데이터베이스와 연동하고 웹 서버를 구축하는 방법을 배우는 수업의 일환으로 진행되었습니다.

## 개요

- Node.js 기반의 웹 애플리케이션 개발
- 데이터베이스(MySQL, MongoDB 등) 연동
- RESTful API 구현
- 웹 서버 구축 및 배포

## 사용 기술

- Node.js
- Express.js (웹 프레임워크)
- MySQL/MongoDB (데이터베이스)
- Postman (API 테스트)


## 프로젝트 구조
node-project/
├── app.js
├── package.json
├── routes/
│   └── api.js
├── controllers/
│   └── apiController.js
├── models/
│   └── database.js
├── config/
│   └── config.js
└── README.md

## 실행 방법

1. 프로젝트 클론: `git clone https://github.com/your-repo/node-project.git`
2. 의존성 설치: `npm install`
3. 데이터베이스 설정 (config/config.js 수정)
4. 개발 서버 실행: `npm run dev`
5. 프로덕션 서버 실행: `npm start`
