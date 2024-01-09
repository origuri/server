export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  description: string;
}

export class CreateUserDto {
  private name: string;
  private email: string;
  private password: string;
  private description: string;

  constructor(props: ICreateUser) {
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.description = props.description;
  }
}
