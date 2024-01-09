import bcrypt from "bcrypt";

export interface ILoginProps {
  email: string;
  password: string;
}

export interface ILoginDto {
  email: string;
  password: string;
  comparePassword: Function;
}

export class LoginDto {
  private email: string;
  private password: string;

  constructor(props: ILoginProps) {
    this.email = props.email;
    this.password = props.password;
  }

  public getEmail = () => {
    return this.email;
  };
  public getPassword = () => {
    return this.password;
  };

  // 비밀번호를 비교하는 메소드
  public comparePassword = async (hashedPassword: string) => {
    // 입력한 비밀번호와 해쉬 비밀번호를 비교하는 함수.
    const isCorrect = await bcrypt.compare(this.password, hashedPassword);
    return isCorrect;
  };
}
