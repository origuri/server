import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";

let users = [
  {
    id: 1,
    name: "오리",
    age: 29,
  },
];

const PORT = 4000;

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

// controller
const handleHome = (req: Request, res: Response) => {
  console.log("홈페이지에 들어가려고 해요!");
  return res.send("hi");
};

const getUsers = (req: Request, res: Response) => {
  res.status(200).json({ users }); // 가져오는 거니까 res
};

// post는 body로 데이터를 받음
const postUsers = (req: Request, res: Response) => {
  const { name, age } = req.body; // 내가 요청해야 되는거니까 req
  console.log("body -> ", req.body);

  users.push({
    id: Date.now(),
    name,
    age,
  });
  res.status(201).json({ users });
};

const patchUsers = (req: Request, res: Response) => {
  const { id } = req.params; // url의 params
  const { name, age } = req.body; // 수정된 정보
  console.log("req.params -> ", req.params);
  const targetUserIdx = users.findIndex((user) => user.id === Number(id));

  users[targetUserIdx] = {
    id: users[targetUserIdx].id,
    name: name ? name : users[targetUserIdx].name,
    age: age ? age : users[targetUserIdx].age,
  };

  // 수정에 성공했을 경우 json을 비워줘야 함.
  res.status(204).json({});
};

const deleteUser = (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedUsers = users.filter((user) => user.id !== Number(id));
  users = deletedUsers;

  // 삭제에 성공했을 경우 json을 비워줘야 함.
  res.status(204).json({});
};

// get 메소드
app.get("/", handleHome);

// 유저 정보 가져오기
// 성공 status 200
app.get("/users", getUsers);

// post 메소드
// 유저 생성 성공 status 201
app.post("/users", postUsers);

// patch 메소드
// 유저 수정 성공 status 204
// req.params.id
app.patch("/users/:id", patchUsers);

// delete 메소드
// 유저 삭제 성공 status 204
app.delete("/users/:id", deleteUser);

const isStart = () => {
  console.log(`서버가 시작되었습니다.🌍🌍 http://localhost:${PORT}/`);
};

// listen는 request를 받는 함수
app.listen(PORT, isStart);
