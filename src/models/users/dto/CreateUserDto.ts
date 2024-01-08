export interface ICreateUser {
  readonly name: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly age: number;
  readonly password: string;
}

export class CreateUserDto {
  private name: string;
  private email: string;
  private phoneNumber: string;
  private age: number;
  private password: string;

  constructor(props: ICreateUser) {
    this.name = props.name;
    this.email = props.email;
    this.phoneNumber = props.phoneNumber;
    this.age = props.age;
    this.password = props.password;
  }
}
