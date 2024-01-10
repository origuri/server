import { UserDto } from "./UserDto";
import bycrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

interface IUpdateUserDtoProps {
  name: string;
  email: string;
  password: string;
  description: string;
}

export class UpdateUserDto {
  private name: string;
  private email: string;
  private password: string;
  private description: string;

  constructor(props: IUpdateUserDtoProps) {
    this.description = props.description;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
  }

  public updatePassword = async () => {
    this.password = await bycrypt.hash(
      this.password,
      Number(process.env.PASSWORD_SALT)
    );
    console.log("이거 -> ", this.password);
  };

  public getUserName = () => {
    return this.name;
  };

  public getUserEmail = () => {
    return this.email;
  };

  public getUserDescription = () => {
    return this.description;
  };
  public getUserPassword = () => {
    return this.password;
  };
}
