import express, { NextFunction, Request, Response } from "express";

const PORT = 4000;

// 서버를 만든 것.
const app = express();

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`난 미들 웨어임 ${req.method}로 ${req.url}로 가려고 해`);
  next(); // handleHome을 호출
};

const privateMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const url = req.url;
  if (url == "/protected") {
    return res.send("여기오면 안돼");
  }
  next();
};

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
// global middleware
app.use(logger);
app.use(privateMiddleware);
// get 메소드
app.get("/", handleHome);
app.get("/login", handleLogin);
app.get("/protected", handleProtected);

const isStart = () => {
  console.log(`서버가 시작되었습니다.🌍🌍 http://localhost:${PORT}/`);
};

// listen는 request를 받는 함수
app.listen(PORT, isStart);
