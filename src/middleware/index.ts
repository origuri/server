import { RowDataPacket } from "mysql2";

export { jwtAuth } from "./jwtAuth";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "dev";
      PORT: string;
      PASSWORD_SALT: string;
      JWT_KEY: string;
      // 추가적인 환경 변수가 있다면 여기에 계속 추가
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: RowDataPacket;
    }
  }
}
