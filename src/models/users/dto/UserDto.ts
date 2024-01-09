export interface IUser {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  age: number;
  password: string;
}

export class UserDto {
  private id: number;
  private name: string;
  private email: string;
  private phoneNumber: string;
  private age: number;
  private password: string;

  constructor(props: IUser) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.phoneNumber = props.phoneNumber;
    this.age = props.age;
    this.password = props.password;
  }

  public getPassword = () => {
    return this.password;
  };
}
