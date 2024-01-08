import { NextFunction, Request, Response, Router } from "express";
import { UserService } from "../service/userService";
import { AuthService } from "../../auth/service/AuthService";

// router
class UserController {
  public router: Router;

  public path: string = "/users";

  public userService;
  public authService;

  // 생성자
  constructor() {
    this.router = Router();
    this.init();
    this.userService = new UserService();
    this.authService = new AuthService();
  }

  private init() {
    //js를 사용하면 bind(this)를 해야 함
    //this.router.get("/", this.getUsers.bind(this));
    this.router.get("/", this.getUsers);
    this.router.get("/detail/:id", this.getUser);
    this.router.get("/detail/:id/fullname", this.getUserFullName);
    this.router.post("/", this.createUser);
  }

  // 타입 스크립트를 사용하면 화살표 함수로 bind를 안해도 된다.
  private getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const users = await this.userService.findUsers();
      if (!users) throw { status: 404, message: "유저가 없습니다." };

      return res.status(200).json({ users: users[0] });
    } catch (err) {
      next(err);
    }
  };

  private getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await this.userService.findUserById(id);
      if (!user) throw { status: 404, message: "유저가 없습니다." };

      return res.status(200).json({ user: user[0] });
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
    } catch (err) {
      next(err);
    }
  };

  private createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { name, age, password, email, phoneNumber } = req.body;
      console.log({ name });

      const newUser = await this.authService.register({
        name,
        age,
        password,
        email,
        phoneNumber,
      });
    } catch (err) {
      next(err);
    }
  };
}

// 클래스를 객체로 만들어 줌
const userController = new UserController();

// 객체를 export 해줌
export default userController;
