import { NextFunction, Request, Response, Router } from "express";
import { CreateUserDto, IUser, UserDto } from "./dto";
import { connection, format, getCreateMapper } from "../../dbConnection";
import MybatisMapper from "mybatis-mapper";
import { Field, ResultSetHeader } from "mysql2";

// dbConnection.ts에서 메퍼와 db 커넥션을 연결시켜주는 함수
getCreateMapper();
// router
class UserController {
  public router: Router;

  public path: string = "/users";

  // 생성자
  constructor() {
    this.router = Router();
    this.init();
  }

  users: IUser[] = [
    {
      id: 1,
      firstName: "임",
      lastName: "오리",
      age: 29,
    },
  ];

  private init() {
    //js를 사용하면 bind(this)를 해야 함
    //this.router.get("/", this.getUsers.bind(this));
    this.router.get("/", this.getUsers);
    this.router.get("/detail/:id", this.getUser);
    this.router.get("/detail/:id/fullname", this.getUserFullName);
    this.router.post("/", this.createUser);
  }

  // 타입 스크립트를 사용하면 화살표 함수로 bind를 안해도 된다.
  private getUsers = (req: Request, res: Response, next: NextFunction) => {
    try {
      // mapper namespace, mapper id, params, format, => format은 dbConnection.ts에서 export 한 것
      let query = MybatisMapper.getStatement("UserMapper", "getUsers", format);
      console.log("마이바티스 쿼리 -> ", query);

      //connection.connect();
      connection.query(
        query,
        (err: any, result: ResultSetHeader, fields: Field) => {
          if (err) {
            console.log("에러 발생-> ", err);
          }
          console.log("결과 -> ", result);
          res.status(200).json({ result });
        }
      );
      //connection.end();
      //const users = this.users.map((user) => new UserDto(user));

      //res.status(200).json({ users });
    } catch (err) {
      next(err);
    }
  };

  private getUser = (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const findUser = this.users.find((user) => user.id === Number(id));

      if (!findUser) {
        // throw {}; => 빈 값이면 에러 핸들러에서 500에러 발생
        throw { status: 404, message: "유저를 찾을 수 없습니다." };
      }

      const user = new UserDto(findUser);

      res.status(200).json({ findUser });
    } catch (err) {
      next(err);
    }
  };

  private getUserFullName = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const findUser = this.users.find((user) => user.id === Number(id));

      if (!findUser) {
        // throw {}; => 빈 값이면 에러 핸들러에서 500에러 발생
        throw { status: 404, message: "유저를 찾을 수 없습니다." };
      }

      const user = new UserDto(findUser);

      res.status(200).json({ fullname: user.getFullName() });
    } catch (err) {
      next(err);
    }
  };

  private createUser = (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, age } = req.body;
      const newUser = new CreateUserDto(firstName, lastName, age).getNewUser();

      this.users.push(newUser);

      res.status(201).json({ users: this.users });
    } catch (err) {
      next(err);
    }
  };
}

// 클래스를 객체로 만들어 줌
const userController = new UserController();

// 객체를 export 해줌
export default userController;
