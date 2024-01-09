import { NextFunction, Request, Response, Router } from "express";
import { AuthService } from "../service/AuthService";
import { ILoginProps, IRegisterUser, LoginDto } from "../dto";

interface IToken {
  accessToken: string;
  refreshToken: string;
}
class AuthController {
  public authService;
  public router;
  public path = "/auth";

  constructor() {
    this.router = Router();
    this.authService = new AuthService();
    this.init();
  }

  private init = () => {
    this.router.post("/register", this.register);
    this.router.post("/login", this.login);
    this.router.post("/refresh", this.refresh);
  };

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const registerBody: IRegisterUser = req.body;

      const { accessToken, refreshToken } = await this.authService.register(
        registerBody
      );

      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: ILoginProps = req.body;
      const header = req.headers;
      console.log({ header });

      const { accessToken, refreshToken } = await this.authService.login(
        new LoginDto(body)
      );

      res.status(200).json({ accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  };

  public refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: IToken = req.body;
      const { accessToken, refreshToken } = await this.authService.refresh(
        body.accessToken,
        body.refreshToken
      );

      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  };
}

const authController = new AuthController();

export default authController;
