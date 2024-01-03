import express from "express";

const PORT = 4000;

// 서버를 만든 것.
const app = express();

// get 메소드
app.get("/", () => console.log("get 메소드 받는 중"));

const isStart = () => {
  console.log(`서버가 시작되었습니다.🌍🌍 http://localhost:${PORT}/`);
};

// listen는 request를 받는 함수
app.listen(PORT, isStart);
