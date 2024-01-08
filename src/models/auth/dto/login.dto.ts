import bcrypt from "bcrypt";

interface ILoginProps {
  email: string;
  password: string;
}

export class LoginDto {
  private email: string;
  private password: string;

  constructor(props: ILoginProps) {
    this.email = props.email;
    this.password = props.password;
  }

  // 비밀번호를 비교하는 메소드

  public comparePassword = async (hashedPassword: string) => {
    // 입력한 비밀번호와 해쉬 비밀번호를 비교하는 함수.
    const isCorrect = await bcrypt.compare(this.password, hashedPassword);
    return isCorrect;
  };
}
