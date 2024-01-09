import { UserService } from "../../users/service/userService";
import { IRegisterUser, RegisterDto } from "../dto/register.dto";
import jwt from "jsonwebtoken";
import envdot from "dotenv";
import { ILoginDto, LoginDto } from "../dto";
import { IUser } from "../../users/dto";
import { IJWT } from "../../../middleware/jwtAuth";

envdot.config();

export class AuthService {
  public userService;

  constructor() {
    this.userService = new UserService();
  }

  // props : registerDto
  public register = async (props: IRegisterUser) => {
    const email = props.email;

    const isExist = await this.userService.checkUserByEmail(email);
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

  // props : LoginDto, 타입을 dto를 넣을 수 있음.
  public login = async (props: LoginDto) => {
    const isExist = await this.userService.checkUserByEmail(props.getEmail());

    if (!isExist)
      throw { status: 404, message: "존재하지 않는 이메일입니다. " };

    // 비밀번호가 맞는지 검증 하기 위한 로직
    const isCorrect = await props.comparePassword(isExist.password);

    if (!isCorrect) throw { status: 400, message: "비밀번호 확인해주세요" };

    // jwt 생성, 확실히 있을 때만 만들어야 함.
    if (isExist) {
      const accessToken = jwt.sign({ id: isExist.id }, process.env.JWT_KEY, {
        expiresIn: "2h",
      });
      const refreshToken = jwt.sign({ id: isExist.id }, process.env.JWT_KEY, {
        expiresIn: "14d",
      });

      console.log({ accessToken, refreshToken });
      return { accessToken, refreshToken };
    } else {
      return { accessToken: "없음", refreshToken: "없음" };
    }
  };

  // accessToken이 만료 되었을 때 refreshToken으로 재갱신
  public refresh = async (accessToken: string, refreshToken: string) => {
    const accessTokenPayload = jwt.verify(accessToken, process.env.JWT_KEY, {
      ignoreExpiration: true, // 만료 된걸 신경쓰지 않겠다.
    });
    const refreshTokenPayload = jwt.verify(refreshToken, process.env.JWT_KEY);

    // accessToken과 refreshToken에 있는 payload 값을 비교
    if ((accessTokenPayload as IJWT).id !== (refreshTokenPayload as IJWT).id) {
      throw { status: 403, message: "권한이 없습니다." };
    }

    const user = await this.userService.findById(
      (accessTokenPayload as IJWT).id
    );

    // jwt 생성, 확실히 있을 때만 만들어야 함.
    if (user) {
      const accessToken = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
        expiresIn: "2h",
      });
      const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
        expiresIn: "14d",
      });

      console.log({ accessToken, refreshToken });
      return { accessToken, refreshToken };
    } else {
      return { accessToken: "없음", refreshToken: "없음" };
    }
  };
}
