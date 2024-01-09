import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserService } from "../models/users/service/userService";

dotenv.config();

export interface IJWT {
  id: number;
  iat: number;
  exp: number;
}

// jwt로 정보를 주고 받을 수 있는 미들웨어
export const jwtAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const headers = req.headers;
    const authoriazation = headers["Authorization"] || headers["authorization"];
    console.log({ headers });

    // 토큰에 bearer가 들어있는지 확인해야 함.
    if (
      authoriazation?.includes("Bearer") ||
      authoriazation?.includes("bearer")
    ) {
      console.log("여기옴?");
      // 또한 토큰의 타입이 string인지 확인해야 함.
      if (typeof authoriazation === "string") {
        // 토큰을 띄어쓰기로 분리할 것.
        // 토큰 형태 -> Bearer ${token}
        const bearers = authoriazation.split(" ");
        console.log({ bearers });

        // bearers = ["Bearer", "token~~~~"];
        if (bearers.length === 2 && typeof bearers[1] === "string") {
          const accessToken = bearers[1];

          if (!process.env.JWT_KEY) {
            next({ status: 400, message: "process.env.JWT_KEY가 잘못됨." });
            return;
          }

          // 받은 jwt를 복호화, 만들 때 user의 id를 사용했기 때문에 그걸로 유저를 인증한다.
          const decodedToken = jwt.verify(accessToken, process.env.JWT_KEY);
          if (!decodedToken) return;
          // decodeToken의 구성을 확인하고 강제로 캐스팅
          console.log({ decodedToken: (decodedToken as IJWT).id });
          console.log({ decodedToken });

          const userService = new UserService();

          const user = await userService.findById((decodedToken as IJWT).id);

          // user가 있다면
          if (user) {
            console.log("유저 찾음요 ~ ->", user);
            req.user = user;
            next();
          } else {
            next({ status: 404, message: "jwt미들웨어 유저를 찾을 수 없다." });
          }
        } else {
          next({ status: 400, message: "토큰이 잘못되었습니다." });
        }
      } else {
        next({ status: 400, message: "토큰이 잘못되었습니다." });
      }
    } else {
      next();
    }

    // 토큰이 있을 수도 있지만 undefined일 수도 있다.
  } catch (error) {
    next({ status: 403 });
  }
};
