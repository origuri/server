import { Request, Response, Router } from "express";

// router
class UserController {
  public router: Router;

  public path: string = "/users";

  // 생성자
  constructor() {
    this.router = Router();
    this.init();
  }

  users = [
    {
      id: 1,
      name: "오리",
      age: 29,
    },
  ];

  private init() {
    //js를 사용하면 bind(this)를 해야 함
    //this.router.get("/", this.getUsers.bind(this));
    this.router.get("/", this.getUsers);
    this.router.get("/detail/:id", this.getUser);
    this.router.post("/", this.createUser);
  }

  // 타입 스크립트를 사용하면 화살표 함수로 bind를 안해도 된다.
  private getUsers = (req: Request, res: Response) => {
    res.status(200).json({ users: this.users });
  };

  private getUser = (req: Request, res: Response) => {
    const { id } = req.params;
    const findUser = this.users.find((user) => user.id === Number(id));
    res.status(200).json({ findUser });
  };

  private createUser = (req: Request, res: Response) => {
    const { name, age } = req.body;
    this.users.push({
      id: Date.now(),
      name,
      age,
    });

    res.status(201).json({ users: this.users });
  };
}

// 클래스를 객체로 만들어 줌
const userController = new UserController();

// 객체를 export 해줌
export default userController;
