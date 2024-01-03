import express from "express";

// 서버를 만든 것.
const app = express();

const PORT = 4000;

const isStart = () => {
  console.log(`서버가 시작되었습니다.🌍🌍 http://localhost:${PORT}/`);
};

// listen는 request를 받는 함수
app.listen(PORT, isStart);
