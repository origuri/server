import { UserService } from "../../users/service/userService";
import { IRegisterUser, RegisterDto } from "../dto/register.dto";
import jwt from "jsonwebtoken";
import envdot from "dotenv";

envdot.config();

export class AuthService {
  public userService;

  constructor() {
    this.userService = new UserService();
  }

  // props : registerDto
  public register = async (props: IRegisterUser) => {
    const email = props.email;

    const isExist = await this.userService.findUserByEmail(email);
    console.log({ isExist });

    // 이메일이 중복이라면
    if (isExist) throw { status: 400, message: "이미 존재하는 이메일입니다. " };
    // createUser의 props는 IRegisterUser이지만 CreateUserDto도 타입은 같음.
    console.log({ email });
    /*  const newUserId = await this.userService.createUser(
      new CreateUserDto({
        ...props,
        // promise이기 때문에 await해야 함.
        // 암호를 변환 시켜서 dto에 넣은 것.
        password: await new RegisterDto(props).hashPassword(),
      })
    ); */

    //이게 더 간단하고 직관적인데..
    const registerDto = new RegisterDto(props);
    const newUserId = await this.userService.createUser({
      ...props,
      password: await registerDto.hashPassword(),
    });

    // jwt 생성, 확실히 있을 때만 만들어야 함.
    if (newUserId && process.env.JWT_KEY) {
      const accessToken = jwt.sign({ id: newUserId }, process.env.JWT_KEY, {
        expiresIn: "2h",
      });
      const refreshToken = jwt.sign({ id: newUserId }, process.env.JWT_KEY, {
        expiresIn: "14d",
      });

      console.log({ accessToken, refreshToken });
      return { accessToken, refreshToken };
    } else {
      return { accessToken: "없음", refreshToken: "없음" };
    }
  };
}
