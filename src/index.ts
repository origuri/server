import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const PORT = 4000;

// 서버를 만든 것.
const app = express();
// log 패키지
const logger = morgan("dev");

/* response 하는 법
express는 request 객체와 response 객체를 보낸다 
타입은 express 패키지의 Request와 Response
request를 받으면 반드시 response를 return 해야한다. 
*/
const handleHome = (req: Request, res: Response) => {
  console.log("홈페이지에 들어가려고 해요!");
  return res.send("hi");
};

const handleLogin = (req: Request, res: Response) => {
  return res.send("여기서 로그인");
};

const handleProtected = (req: Request, res: Response, next: NextFunction) => {
  return res.send("프라이빗 라운지");
};

const today = new Date();
const todayToDayjs = dayjs(today).format("YYYY-MM-DD");
// { todayToDayjs: '2024-01-04' }
console.log({ todayToDayjs });

const password = "1234";
// password는 string 타입이여야 함, 뒤에는 salt 몇 번 돌릴지
const hashedPassword = bcrypt.hashSync(password, 10);
console.log({ hashedPassword });

const token = jwt.sign("1234", "abcd");
console.log({ token });

// global middleware
app.use(logger);
// 도메인 차단
app.use(cors());
// 보안 강화
app.use(helmet());

// get 메소드
app.get("/", handleHome);
app.get("/login", handleLogin);
app.get("/protected", handleProtected);

const isStart = () => {
  console.log(`서버가 시작되었습니다.🌍🌍 http://localhost:${PORT}/`);
};

// listen는 request를 받는 함수
app.listen(PORT, isStart);
