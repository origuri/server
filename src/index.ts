import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";

import dotenv from "dotenv";

import { Controllers } from "./models/index";
import { jwtAuth } from "./middleware";
interface IError {
  status?: number;
  message?: string;
}

dotenv.config();

const PORT = Number(process.env.PORT);

(async () => {
  // 서버를 만든 것.
  const app = express();
  // log 패키지
  const logger = morgan("dev");

  // global middleware
  app.use(logger); // log
  app.use(cors()); // 도메인 제한
  app.use(helmet()); // 보안
  app.use(express.json()); // json으로 데이터 받기
  app.use(express.urlencoded({ extended: true, limit: "700mb" })); // url 쿼리
  app.use(jwtAuth);

  // user 라우터 등록
  //app.use("/users", UserController.router);
  Controllers.forEach((controller) => {
    app.use(controller.path, controller.router);
  });

  // controller
  const handleHome = (req: Request, res: Response) => {
    console.log("홈페이지에 들어가려고 해요!");
    return res.send("hi");
  };

  // 에러 핸들링
  app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
    console.log(err);

    res.status(err.status || 500).json({ message: err.message || "서버 에러" });
  });

  // get 메소드
  app.get("/", handleHome);

  const isStart = () => {
    console.log(`서버가 시작되었습니다.🌍🌍 http://localhost:${PORT}/`);
  };

  // listen는 request를 받는 함수
  app.listen(PORT, isStart);
})();
