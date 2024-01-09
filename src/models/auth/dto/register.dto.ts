import bcrypt from "bcrypt";
import dotenv from "dotenv";

export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  description: string;
}

dotenv.config();

export class RegisterDto {
  private name: string;
  private email: string;
  private password: string;
  private description: string;

  constructor(props: IRegisterUser) {
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.description = props.description;
  }

  // 비밀번호 암호화하는 함수
  public hashPassword = async () => {
    const hashedPassword = await bcrypt.hash(
      this.password,
      Number(process.env.PASSWORD_SALT)
    );

    return hashedPassword;
  };
}
