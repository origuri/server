import { NextFunction, Request, Response, Router } from "express";
import { AuthService } from "../service/AuthService";
import { IRegisterUser } from "../dto";

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
}

const authController = new AuthController();

export default authController;
