import bcrypt from "bcrypt";
import dotenv from "dotenv";

export interface IRegisterUser {
  readonly name: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly age: number;
  readonly password: string;
}

dotenv.config();

export class RegisterDto {
  private name: string;
  private email: string;
  private phoneNumber: string;
  private age: number;
  private password: string;

  constructor(props: IRegisterUser) {
    this.name = props.name;
    this.email = props.email;
    this.phoneNumber = props.phoneNumber;
    this.age = props.age;
    this.password = props.password;
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
